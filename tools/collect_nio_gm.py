#!/usr/bin/env python3
"""
GlucoEdge NIO-GM serial data collector.

Reads CSV rows from ESP32 firmware and appends to a local dataset file.
Auto-detects serial port on macOS/Linux when --port is omitted.

Usage:
  python3 tools/collect_nio_gm.py
  python3 tools/collect_nio_gm.py --port /dev/cu.usbmodem1101
  python3 tools/collect_nio_gm.py --port COM3          # Windows
"""

from __future__ import annotations

import argparse
import csv
import sys
import time
from datetime import datetime
from pathlib import Path

try:
    import serial
    from serial.tools import list_ports
except ImportError:
    print("Install pyserial: pip install pyserial", file=sys.stderr)
    sys.exit(1)

DEFAULT_BAUD = 115200
DEFAULT_OUTPUT = Path("data/nio_gm_raw_dataset.csv")

HEADERS = [
    "pc_timestamp",
    "esp_millis",
    "max_red",
    "max_ir",
    "nir1_raw",
    "nir2_raw",
    "skin_temp_c",
]


def find_esp32_port() -> str | None:
    """Heuristic: common ESP32 USB-UART vendor strings."""
    hints = ("usbmodem", "usbserial", "SLAB", "CP210", "CH340", "Espressif")
    for port in list_ports.comports():
        blob = f"{port.device} {port.description} {port.manufacturer or ''}"
        if any(h.lower() in blob.lower() for h in hints):
            return port.device
    return None


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Collect NIO-GM serial CSV data")
    parser.add_argument(
        "--port",
        help="Serial port (auto-detect if omitted)",
    )
    parser.add_argument(
        "--baud",
        type=int,
        default=DEFAULT_BAUD,
        help=f"Baud rate (default {DEFAULT_BAUD})",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=DEFAULT_OUTPUT,
        help=f"Output CSV path (default {DEFAULT_OUTPUT})",
    )
    parser.add_argument(
        "--append",
        action="store_true",
        help="Append to existing file instead of overwriting",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    port = args.port or find_esp32_port()
    if not port:
        print(
            "No serial port found. Pass --port explicitly "
            "(macOS: /dev/cu.usbmodem*, Linux: /dev/ttyUSB*, Windows: COM*)",
            file=sys.stderr,
        )
        return 1

    args.output.parent.mkdir(parents=True, exist_ok=True)
    write_header = not args.output.exists() or not args.append
    mode = "a" if args.append else "w"

    print(f"Opening {port} @ {args.baud} …")
    ser = serial.Serial(port, args.baud, timeout=1)
    time.sleep(2)  # allow ESP32 reset after USB open

    print(f"Writing to {args.output.resolve()}")
    print("Listening — Ctrl+C to stop.\n")

    rows = 0
    with args.output.open(mode, newline="") as fh:
        writer = csv.writer(fh)
        if write_header:
            writer.writerow(HEADERS)

        try:
            while True:
                raw = ser.readline()
                if not raw:
                    continue
                line = raw.decode("utf-8", errors="replace").strip()
                if not line or line.startswith("#"):
                    if line.startswith("#"):
                        print(line)
                    continue

                parts = line.split(",")
                if len(parts) != 6:
                    print(f"skip malformed: {line!r}")
                    continue

                row = [datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f")[:-3]] + parts
                writer.writerow(row)
                fh.flush()
                rows += 1

                if rows % 100 == 0:
                    print(f"  {rows} rows … latest nir1={parts[3]} temp={parts[5]}")

        except KeyboardInterrupt:
            print(f"\nStopped. {rows} rows saved to {args.output}")
        finally:
            ser.close()

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
