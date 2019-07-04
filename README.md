# zip

Robust ZIP decoder. Be
[~liberal~](https://en.wikipedia.org/wiki/Robustness_principle#Criticism)
conservative in what you accept.

## Installation

```
npm install @ronomon/zip
```

## Usage

Inspect the local file headers of an archive at the command line:

```bash
scripts/decode <file>
```

Parse the local file headers of an archive:

```javascript
var ZIP = require('@ronomon/zip');
var buffer = fs.readFileSync(file);
try {
  var headers = ZIP.decode(buffer);
} catch (error) {
  console.error(error.message);
}
````

Extract the file data of a local file header:

```javascript
var file = ZIP.inflate(header, buffer);
````

## Robust

* Rejects zip files that are too small, i.e. less than 22 bytes.

* Rejects zip files that exceed the 4 GB limit.

* Rejects zip files that are truncated, i.e. with no end of central directory
record.

* Rejects zip files with prepended data, whether zeroed or buffer bleed.

* Rejects zip files with appended data, whether zeroed or buffer bleed.

* Rejects zip files with dangerous compression ratios, i.e. more than 100 to 1.

* Rejects malicious rar, tar and xar files that pretend to be zip files.

* Rejects local file headers that overlap.

* Rejects local file headers that diverge from the central directory.

* Rejects local file headers that overflow each other or the central directory.

* Rejects local file headers that underflow each other or the central directory,
i.e. gaps between local files or between the last local file and the central
directory.

* Rejects local file headers with invalid combinations of bit 3, crc32 and
compressed or uncompressed sizes.

* Rejects data descriptors that overflow.

* Rejects central directory headers that overflow.

* Rejects central directory headers that underflow, whether zeroed or buffer
bleed.

* Rejects archives spanning multiple disks.

* Rejects encryption and archive headers.

* Rejects encryption mechanisms.

* Rejects compression methods other than 0 (uncompressed) or 8 (deflate).

* Rejects ZIP64 version 2 (and ZIP64 version 1).

* Rejects unused and reserved flags.

* Accepts UTF-8 and CP437 character encodings.

* Rejects unequal compressed and uncompressed sizes when a file is store
uncompressed.

* Rejects MS-DOS date years after 2099 that are not correctly handled by other
zip implementations.

* Rejects MS-DOS date months that are out of range, i.e. 0 or more than 12.

* Rejects MS-DOS date days that are out of range, i.e. 0 or more than 31.

* Rejects MS-DOS date hours that are out of range, i.e. more than 23.

* Rejects MS-DOS date minutes that are out of range, i.e. more than 59.

* Rejects MS-DOS date seconds that are out of range, i.e. more than 59.

* Rejects unicode path extra fields that overflow.

* Rejects unicode path extra fields that underflow, whether zeroed or buffer
bleed.

* Rejects unicode path extra fields that have an invalid version.

* Rejects unicode path extra fields that diverge from the central directory to
prevent ambiguity, i.e. in file extension.

* Rejects extra fields that exceed 4096 bytes.

* Rejects extra fields with an invalid length, i.e. only 1, 2 or 3 bytes.

* Rejects invalid UTF-8 strings.

* Rejects directories that pretend to be files, i.e. with compressed or
uncompressed sizes not equal to 0.

* Rejects file names containing null bytes.

* Rejects file names containing backslashes. All slashes must be forward slashes
according to the spec.

* Rejects file names exceeding 256 bytes.

* Rejects directory traversal via file name.

* Rejects directory traversal via symlink.

* Rejects compressed symlinks.

* Rejects symlinks that exceed 1024 bytes.

## Tests

`@ronomon/zip` has been tested on several large and diverse data
sets, including David Fifield's
[better zip bomb](https://www.bamsoftware.com/hacks/zipbomb/), but automated
fuzz tests are yet to be included.
