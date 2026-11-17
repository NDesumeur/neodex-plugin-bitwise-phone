# Bitwise

Binary from every angle: one number written in every base at once, every bit clickable, bitwise operations laid out in columns and explained, text as bytes, the ASCII table and floating-point numbers broken down.

*Version française : [README.md](README.md)*

![Bitwise](screenshots/1.jpg)

## Phone version

- Each field (decimal, hex, binary…) has its label above and takes the full width.
- Bits are tapped with a finger, eight per line; the ASCII table fits in two columns (tap a character to open it in Number).
- Same settings as on PC (same id `neodex.bitwise`).

## Number

- Type in **any field** (decimal, hexadecimal, binary, octal or characters): the others follow as you type. The `0x`, `0b` and `0o` prefixes work everywhere; spaces and `_` are ignored.
- **Width**: 8, 16, 32 or 64 bits. **Signed** reads the leftmost bit as a minus sign (two's complement), and `-1` becomes `1111…1`.
- **Bits**: a click turns a bit on or off; each box shows its number, the tooltip its value.
- **Quick actions**: NOT, shifts, rotations, negate, byte-order swap (little / big endian), all 0, all 1.
- **Info**: number of bits set, highest bit, power of 2, parity, signed and unsigned value, range of the chosen width.

## Operations

A and B (decimal, `0x…`, `0b…` or long binary), then AND, OR, XOR, NAND, NOR, XNOR, `<<`, `>>`, `>>>`, ROL, ROR, +, − and ×. Both numbers and the result line up bit under bit, with a sentence explaining the operation. **Result → A** chains calculations.

## Text

A text becomes its UTF-8 bytes in hexadecimal, binary, decimal or Base64 (with the character and byte count: "é" takes 2 bytes). The other way round, paste bytes to get the text back.

## ASCII table

The 128 characters with their code in decimal, hexadecimal and binary, and the names of the control characters (NUL, TAB, LF…). A click opens it in **Number**.

## Floating point

A number as `float` (32 bits) or `double` (64 bits): sign, exponent and mantissa in colour, the formula, the value actually stored (you can see why 0.1 is never exact) and the special cases (zero, infinity, NaN, denormals). The bits are clickable here too.

## Data

The last numbers, the text and the open tab are kept in the plugin's folder. Permission: `storage` only.

## Version 1.1.0

- Larger text and clickable bits; the app uses the full width (32 bits on one line).
- **Ready-made masks** (Number tab): set, clear, toggle or test bit n, keep the n low bits. Each mask shows the computation (x, the mask, the result) and explains why it works.
- **Sliding bits** (Operations tab): for <<, >>, >>>, ROL and ROR, the "Watch the bits slide" button shows the shift one position at a time.
