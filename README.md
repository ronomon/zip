# zip

Robust ZIP decoder with defenses against dangerous compression ratios, spec
deviations, malicious archive signatures, mismatching local and central
directory headers, ambiguous UTF-8 filenames, directory and symlink traversals,
invalid MS-DOS dates, overlapping headers, overflow, underflow, sparseness,
buffer bleeds etc.

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
var buffer = fs.readFileSync(archive);
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

* Rejects zip files that exceed 2 GB to protect vulnerable downstream zip
implementations from `int32_t` overflow.

* Rejects zip files that are truncated, i.e. with no end of central directory
record.

* Rejects zip files with prepended data, which can be exploited to distribute
[malicious JAR files appended to MSI files signed by third parties](https://blog.virustotal.com/2019/01/distribution-of-malicious-jar-appended.html)
and other chameleon files. A chameleon file is an ambiguous file that looks
different depending on the parser implementation used to open the file.

* Rejects zip files with appended data, which can be exploited for malware
stuffing or which might represent buffer bleeds.

* Rejects zip files with dangerous compression ratios, i.e. more than 100 to 1.
These are unlikely to be benign.

* Rejects zip files with excessively negative compression ratios
([CVE-2018-18384](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2018-18384)).

* Rejects malicious rar, tar and xar files that pretend to be zip files in order
to evade content type detection or antivirus scanning. Some unzip utilities will
unzip these files.

* Rejects local file headers that overlap, which can be exploited for zip bombs.

* Rejects local file headers that diverge from the central directory header,
which can be exploited to create ambiguity in file metadata or content. For
example, some decoders might interpret the local file header as a malicious EXE
file, while most decoders might interpret the central directory header as a
harmless TXT file.

* Rejects local file headers that overflow each other or the central directory,
which can be exploited for remote code execution.

* Rejects local file headers that underflow each other or the central directory,
i.e. gaps between local files or between the last local file and the central
directory, which might be exploited for malware stuffing or which might
represent buffer bleeds.

* Rejects local file headers with invalid combinations of bit 3, crc32 and
compressed or uncompressed sizes. Malware hygiene is poor when it comes to the
spec.

* Rejects data descriptors that overflow.

* Rejects central directory headers that overflow.

* Rejects central directory headers that underflow.

* Rejects archives spanning multiple disks, encryption mechanisms and archive
headers, compression methods other than 0 (uncompressed) or 8 (deflate), ZIP64
version 2 (and ZIP64 version 1), unused and reserved flags, since all of these
are rejected by [ISO/IEC 21320-1:2015](https://www.iso.org/standard/60101.html).
Encrypted archives are often used to distribute malware and evade antivirus
scanning.

* Rejects compression methods greater than 999 to prevent buffer overflows
([CVE-2016-9844](https://bugs.launchpad.net/ubuntu/+source/unzip/+bug/1643750)).

* Accepts UTF-8 as well as the CP437 character encoding contrary to
[ISO/IEC 21320-1:2015](https://www.iso.org/standard/60101.html) since CP437 is a
common zip character encoding.

* Rejects unequal compressed and uncompressed sizes when a file is stored
uncompressed, which can exploited to create ambiguity, i.e. in file content.

* Rejects MS-DOS date years after 2099 that are not correctly handled by some
zip implementations.

* Rejects MS-DOS date months that are out of range, i.e. 0 or more than 12,
characteristic of malware archives.

* Rejects MS-DOS date days that are out of range, i.e. 0 or more than 31,
characteristic of malware archives.

* Rejects MS-DOS date hours that are out of range, i.e. more than 23,
characteristic of malware archives.

* Rejects MS-DOS date minutes that are out of range, i.e. more than 59,
characteristic of malware archives.

* Rejects MS-DOS date seconds that are out of range, i.e. more than 59,
characteristic of malware archives.

* Rejects unicode path extra fields that overflow.

* Rejects unicode path extra fields that underflow.

* Rejects unicode path extra fields that have an invalid version.

* Rejects unicode path extra fields that diverge from the central directory,
which can be exploited to create ambiguity, i.e. in file extension.

* Rejects extra fields that exceed 4096 bytes as an arbitrary upper bound.

* Rejects extra fields with an invalid length, i.e. only 1, 2 or 3 bytes.

* Rejects invalid UTF-8 strings, which can be used to exploit vulnerable UTF-8
decoders.

* Rejects directories that pretend to be files, i.e. with compressed or
uncompressed sizes not equal to 0.

* Rejects dangerous unix mode permissions: setuid, setgid and sticky bits
([CVE-2005-0602](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2005-0602)).

* Rejects dangerous unix mode types: block devices, character devices, fifo
special files and sockets.

* Rejects file names containing null bytes.

* Rejects file names containing control characters, which can be used to mask
".." as part of a directory traversal
([CVE-2003-0282](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2003-0282)).

* Rejects file names containing backslashes. All slashes must be forward slashes
according to the spec.

* Rejects file names exceeding 4096 bytes to prevent buffer overflows
([CVE-2018-1000035](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2018-1000035)).

* Rejects file name components exceeding 255 bytes to prevent buffer overflows.

* Rejects directory traversal via file name, which can be exploited to overwrite
system files.

* Rejects directory traversal via symlink, which can be exploited to overwrite
system files. Some zip decoders, including antivirus scanners and popular email
services, do not detect directory traversal via symlink.

* Rejects compressed symlinks for simplicity, since these are highly unlikely.

* Rejects symlinks that exceed 1024 bytes as an arbitrary upper bound to prevent
runaway string decoding.

## Tests

`@ronomon/zip` has been tested on several large and diverse data
sets, including David Fifield's
["A better zip bomb"](https://www.bamsoftware.com/hacks/zipbomb/).

Automated fuzz tests are yet to be included.
