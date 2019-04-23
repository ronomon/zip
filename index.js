'use strict';

var assert = require('assert');

var Node = {
  zlib: require('zlib')
};

var CRC32 = function(buffer) {
  var crc = -1;
  for (var index = 0, length = buffer.length; index < length; index++) {
    crc = CRC32.TABLE[(crc ^ buffer[index]) & 0xFF] ^ (crc >>> 8);
  }
  return (crc ^ -1) >>> 0;
};

CRC32.TABLE = new Int32Array([
  0x00000000, 0x77073096, 0xee0e612c, 0x990951ba, 0x076dc419,
  0x706af48f, 0xe963a535, 0x9e6495a3, 0x0edb8832, 0x79dcb8a4,
  0xe0d5e91e, 0x97d2d988, 0x09b64c2b, 0x7eb17cbd, 0xe7b82d07,
  0x90bf1d91, 0x1db71064, 0x6ab020f2, 0xf3b97148, 0x84be41de,
  0x1adad47d, 0x6ddde4eb, 0xf4d4b551, 0x83d385c7, 0x136c9856,
  0x646ba8c0, 0xfd62f97a, 0x8a65c9ec, 0x14015c4f, 0x63066cd9,
  0xfa0f3d63, 0x8d080df5, 0x3b6e20c8, 0x4c69105e, 0xd56041e4,
  0xa2677172, 0x3c03e4d1, 0x4b04d447, 0xd20d85fd, 0xa50ab56b,
  0x35b5a8fa, 0x42b2986c, 0xdbbbc9d6, 0xacbcf940, 0x32d86ce3,
  0x45df5c75, 0xdcd60dcf, 0xabd13d59, 0x26d930ac, 0x51de003a,
  0xc8d75180, 0xbfd06116, 0x21b4f4b5, 0x56b3c423, 0xcfba9599,
  0xb8bda50f, 0x2802b89e, 0x5f058808, 0xc60cd9b2, 0xb10be924,
  0x2f6f7c87, 0x58684c11, 0xc1611dab, 0xb6662d3d, 0x76dc4190,
  0x01db7106, 0x98d220bc, 0xefd5102a, 0x71b18589, 0x06b6b51f,
  0x9fbfe4a5, 0xe8b8d433, 0x7807c9a2, 0x0f00f934, 0x9609a88e,
  0xe10e9818, 0x7f6a0dbb, 0x086d3d2d, 0x91646c97, 0xe6635c01,
  0x6b6b51f4, 0x1c6c6162, 0x856530d8, 0xf262004e, 0x6c0695ed,
  0x1b01a57b, 0x8208f4c1, 0xf50fc457, 0x65b0d9c6, 0x12b7e950,
  0x8bbeb8ea, 0xfcb9887c, 0x62dd1ddf, 0x15da2d49, 0x8cd37cf3,
  0xfbd44c65, 0x4db26158, 0x3ab551ce, 0xa3bc0074, 0xd4bb30e2,
  0x4adfa541, 0x3dd895d7, 0xa4d1c46d, 0xd3d6f4fb, 0x4369e96a,
  0x346ed9fc, 0xad678846, 0xda60b8d0, 0x44042d73, 0x33031de5,
  0xaa0a4c5f, 0xdd0d7cc9, 0x5005713c, 0x270241aa, 0xbe0b1010,
  0xc90c2086, 0x5768b525, 0x206f85b3, 0xb966d409, 0xce61e49f,
  0x5edef90e, 0x29d9c998, 0xb0d09822, 0xc7d7a8b4, 0x59b33d17,
  0x2eb40d81, 0xb7bd5c3b, 0xc0ba6cad, 0xedb88320, 0x9abfb3b6,
  0x03b6e20c, 0x74b1d29a, 0xead54739, 0x9dd277af, 0x04db2615,
  0x73dc1683, 0xe3630b12, 0x94643b84, 0x0d6d6a3e, 0x7a6a5aa8,
  0xe40ecf0b, 0x9309ff9d, 0x0a00ae27, 0x7d079eb1, 0xf00f9344,
  0x8708a3d2, 0x1e01f268, 0x6906c2fe, 0xf762575d, 0x806567cb,
  0x196c3671, 0x6e6b06e7, 0xfed41b76, 0x89d32be0, 0x10da7a5a,
  0x67dd4acc, 0xf9b9df6f, 0x8ebeeff9, 0x17b7be43, 0x60b08ed5,
  0xd6d6a3e8, 0xa1d1937e, 0x38d8c2c4, 0x4fdff252, 0xd1bb67f1,
  0xa6bc5767, 0x3fb506dd, 0x48b2364b, 0xd80d2bda, 0xaf0a1b4c,
  0x36034af6, 0x41047a60, 0xdf60efc3, 0xa867df55, 0x316e8eef,
  0x4669be79, 0xcb61b38c, 0xbc66831a, 0x256fd2a0, 0x5268e236,
  0xcc0c7795, 0xbb0b4703, 0x220216b9, 0x5505262f, 0xc5ba3bbe,
  0xb2bd0b28, 0x2bb45a92, 0x5cb36a04, 0xc2d7ffa7, 0xb5d0cf31,
  0x2cd99e8b, 0x5bdeae1d, 0x9b64c2b0, 0xec63f226, 0x756aa39c,
  0x026d930a, 0x9c0906a9, 0xeb0e363f, 0x72076785, 0x05005713,
  0x95bf4a82, 0xe2b87a14, 0x7bb12bae, 0x0cb61b38, 0x92d28e9b,
  0xe5d5be0d, 0x7cdcefb7, 0x0bdbdf21, 0x86d3d2d4, 0xf1d4e242,
  0x68ddb3f8, 0x1fda836e, 0x81be16cd, 0xf6b9265b, 0x6fb077e1,
  0x18b74777, 0x88085ae6, 0xff0f6a70, 0x66063bca, 0x11010b5c,
  0x8f659eff, 0xf862ae69, 0x616bffd3, 0x166ccf45, 0xa00ae278,
  0xd70dd2ee, 0x4e048354, 0x3903b3c2, 0xa7672661, 0xd06016f7,
  0x4969474d, 0x3e6e77db, 0xaed16a4a, 0xd9d65adc, 0x40df0b66,
  0x37d83bf0, 0xa9bcae53, 0xdebb9ec5, 0x47b2cf7f, 0x30b5ffe9,
  0xbdbdf21c, 0xcabac28a, 0x53b39330, 0x24b4a3a6, 0xbad03605,
  0xcdd70693, 0x54de5729, 0x23d967bf, 0xb3667a2e, 0xc4614ab8,
  0x5d681b02, 0x2a6f2b94, 0xb40bbe37, 0xc30c8ea1, 0x5a05df1b,
  0x2d02ef8d
]);
assert(CRC32.TABLE.length === 256);

var ZIP = {};

ZIP.assertCompressionMethod = function(method) {
  var self = this;
  self.assertUInt32(method);
  if (method === 99) {
    throw new Error('unsupported: encrypted compression method');
  }
  if (method !== 0 && method !== 8) {
    throw new Error('unsupported: compression method=' + method);
  }
};

ZIP.assertCompressionMethodSizes = function(method, compressed, uncompressed) {
  var self = this;
  self.assertCompressionMethod(method);
  self.assertUInt32(compressed);
  self.assertUInt32(uncompressed);
  if (method === 0 && compressed !== uncompressed) {
    throw new Error(
      'no compression, yet compressed size=' + compressed +
      ' and uncompressed size=' + uncompressed
    );
  }
};

ZIP.assertDataDescriptorMatchesCentralDirectoryFile = function(a, b) {
  var self = this;
  var keys = [
    'crc32',
    'compressedSize',
    'uncompressedSize'
  ];
  for (var index = 0; index < keys.length; index++) {
    var key = keys[index];
    var x = a[key];
    var y = b[key];
    assert(x !== undefined);
    assert(y !== undefined);
    if (x !== y) {
      throw new Error(
        'data descriptor ' + key + ' diverges from central directory file: ' +
        JSON.stringify(x) + ' vs ' +
        JSON.stringify(y)
      );
    }
  }
};

ZIP.assertDate = function(date) {
  var self = this;
  self.assertUInt32(date);
  /*
  An MS-DOS date is a packed 16-bit (2 bytes) value in which bits in the value
  represent the day, month, and year:
  
     Bits:  0-4   5-8    9-15
     Unit:  Day   Month  Year
    Range:  1-31  1-12   Relative to 1980
  */
  var day = date & 31;
  if (day === 0 || day > 31) {
    throw new Error('ms-dos day out of range: ' + day + ' date=' + date);
  }
  var month = (date >>> 5) & 15;
  if (month === 0 || month > 12) {
    throw new Error('ms-dos month out of range: ' + month + ' date=' + date);
  }
  var year = (date >>> 9) + 1980;
  if (year > 2099) {
    // 7 bits supports up to 127 years, or 2107 (1980 + 127).
    // However, dates after 2099 are not correctly handled by some software.
    throw new Error('ms-dos year out of range: ' + year + ' date=' + date);
  }
};

ZIP.assertDisk = function(disk) {
  var self = this;
  self.assertUInt32(disk);
  if (disk !== 0) throw new Error('unsupported: multiple disks: disk=' + disk);
};

ZIP.assertExtraField = function(header) {
  var self = this;
  var buffer = header.extraField;
  var offset = 0;
  while (offset + 4 <= buffer.length) {
    var id = buffer.readUInt16LE(offset);
    var size = buffer.readUInt16LE(offset + 2);
    if (id === 0x7075) {
      if (size < 5) throw new Error('unicode path extra field overflow');
      var version = buffer[offset + 4];
      if (version !== 1) {
        throw new Error('unicode path extra field has an invalid version');
      }
      // We require the unicode path to match the central directory file even if
      // the crc32 of the non-unicode path is different. Otherwise, an attacker
      // could present alternative extension types to bypass content inspection.
      var crc32 = buffer.readUInt32LE(offset + 5);
      var path = buffer.toString('utf-8', offset + 9, offset + 9 + size - 5);
      assert(typeof header.fileName === 'string');
      if (path !== header.fileName) {
        throw new Error(
          'unicode path extra field diverges from central directory file: ' +
          JSON.stringify(path) + ' vs ' + JSON.stringify(header.fileName)
        );
      }
    }
    offset += 4;
    offset += size;
  }
  if (offset < buffer.length) {
    if (self.zeroed(buffer, offset, buffer.length - offset)) {
      throw new Error('extra field underflow (zeroed)');
    } else {
      throw new Error('extra field underflow');
    }
  }
  if (offset > buffer.length) throw new Error('extra field overflow');
};

ZIP.assertExtraFieldLength = function(length) {
  var self = this;
  self.assertUInt32(length);
  if (length > 4096) {
    throw new Error('extra field length exceeds 4096 bytes: ' + length);
  }
  // The extra field contains a variety of optional data such as OS-specific
  // attributes. It is divided into chunks, each with a 16-bit ID code and a
  // 16-bit length.
  if (length !== 0 && length < 4) {
    throw new Error('extra field length must be 0 or at least 4 bytes');
  }
};

ZIP.assertFileName = function(value) {
  var self = this;
  assert(typeof value === 'string');
  if (
    /^[a-zA-Z]:|^\/|^\\/.test(value) ||
    value.split(/\/|\\/).indexOf('..') !== -1
  ) {
    // File name contains a drive path, is an absolute or invalid relative path.
    throw new Error(
      'directory traversal (via file name): ' + JSON.stringify(value)
    );
  }
  if (/\\/.test(value)) {
    // All slashes must be forward slashes according to APPNOTE.TXT.
    throw new Error('file name contains backslash: ' + JSON.stringify(value));
  }
};

ZIP.assertFileNameLength = function(length) {
  var self = this;
  self.assertUInt32(length);
  // File name length may be 0 if input came from stdin.
  if (length > 256) {
    throw new Error('file name length exceeds 256 bytes: ' + length);
  }
};

ZIP.assertFirstSignature = function(buffer, records) {
  var self = this;
  assert(Buffer.isBuffer(buffer));
  self.assertUInt32(records);
  assert(buffer.length >= 8);
  // We expect a Local File Header or End Of Central Directory Record signature:
  var signature = records > 0 ? 0x04034b50 : 0x06054b50;
  var a = buffer.readUInt32LE(0);
  if (a === signature) return 0;
  // A spanned/split archive may be preceded by a special spanning signature:
  // See APPNOTE 8.5.3 and 8.5.4.
  var b = buffer.readUInt32LE(4);
  if (b === signature && (a === 0x08074b50 || a === 0x30304b50)) return 4;
  var shift = self.findShift(buffer, signature);
  if (shift === -1) throw new Error('zip file has prepended data');
  assert(shift !== 0);
  var zeroed = self.zeroed(buffer, 0, shift) ? ' (zeroed)' : '';
  throw new Error(
    'zip file has prepended data' + zeroed + ': ' + self.bytes(shift)
  );
};

ZIP.assertGeneralPurposeBitFlag = function(flag) {
  var self = this;
  self.assertUInt32(flag);
  if (flag & (1 << 0)) throw new Error('unsupported: traditional encryption');
  if (flag & (1 << 4)) throw new Error('unsupported: enhanced deflate');
  if (flag & (1 << 5)) throw new Error('unsupported: compressed patched data');
  if (flag & (1 << 6)) throw new Error('unsupported: strong encryption');
  if (flag & (1 << 7)) throw new Error('unsupported: unused flag bit 7');
  if (flag & (1 << 8)) throw new Error('unsupported: unused flag bit 8');
  if (flag & (1 << 9)) throw new Error('unsupported: unused flag bit 9');
  if (flag & (1 << 10)) throw new Error('unsupported: unused flag bit 10');
  if (flag & (1 << 12)) throw new Error('unsupported: enhanced compression');
  if (flag & (1 << 13)) throw new Error('unsupported: masked local headers');
  if (flag & (1 << 14)) throw new Error('unsupported: reserved flag bit 14');
  if (flag & (1 << 15)) throw new Error('unsupported: reserved flag bit 15');
};

ZIP.assertLocalFileMatchesCentralDirectoryFile = function(a, b) {
  var self = this;
  var keys = [
    'generalPurposeBitFlag',
    'compressionMethod',
    'lastModFileTime',
    'lastModFileDate',
    'crc32',
    'compressedSize',
    'uncompressedSize',
    'fileName',
    'fileNameLength'
  ];
  for (var index = 0; index < keys.length; index++) {
    var key = keys[index];
    var x = a[key];
    var y = b[key];
    assert(x !== undefined);
    assert(y !== undefined);
    if (x !== y) {
      if (a.generalPurposeBitFlag & (1 << 3)) {
        if (key === 'crc32' && x === 0) continue;
        if (key === 'compressedSize' && x === 0) continue;
        if (key === 'uncompressedSize' && x === 0) continue;
      }
      throw new Error(
        'local file ' + key + ' diverges from central directory file: ' +
        JSON.stringify(x) + ' vs ' +
        JSON.stringify(y)
      );
    }
  }
};

ZIP.assertSymlink = function(path, value) {
  var self = this;
  assert(typeof path === 'string');
  assert(typeof value === 'string');
  if (/^[a-zA-Z]:|^\//.test(value) || value.split('/').indexOf('..') !== -1) {
    // Symlink contains a drive path, is an absolute or invalid relative path.
    throw new Error(
      'directory traversal (via symlink): ' +
      JSON.stringify(path) + ' > ' + JSON.stringify(value)
    );
  }
};

ZIP.assertTime = function(time) {
  var self = this;
  self.assertUInt32(time);
  /*
  An MS-DOS time is a packed 16-bit (2 bytes) value in which bits in the value
  represent the hour, minute, and second:
  
     Bits:  0-4     5-10    11-15
     Unit:  Second  Minute  Hour
    Range:  0-59    0-59    0-23
  */
  var second = (time & 31) * 2;
  if (second > 59) {
    throw new Error('ms-dos second out of range: ' + second + ' time=' + time);
  }
  var minute = (time >>> 5) & 63;
  if (minute > 59) {
    throw new Error('ms-dos minute out of range: ' + minute + ' time=' + time);
  }
  var hour = (time >>> 11);
  if (hour > 23) {
    throw new Error('ms-dos hour out of range: ' + hour + ' time=' + time);
  }
};

ZIP.assertUInt32 = function(integer) {
  var self = this;
  assert(Number.isInteger(integer));
  assert(integer >= 0 && integer <= Math.pow(2, 32) - 1);
};

ZIP.bytes = function(integer) {
  var self = this;
  self.assertUInt32(integer);
  return integer + (integer === 1 ? ' byte' : ' bytes');
};

ZIP.decode = function(buffer) {
  var self = this;
  // SPEC: https://pkware.cachefly.net/webdocs/casestudies/APPNOTE.TXT

  // Further, as per ISO/IEC 21320-1:2015, we disable support for:
  // * multiple disks
  // * encryption and archive headers
  // * encryption mechanisms
  // * compression methods other than 0 or 8
  // * ZIP64 version 2 (and we also disable ZIP64 version 1)
  // * unused and reserved flags
  
  // Contrary to ISO/IEC 21320-1:2015, we do not require:
  // * `version needed to extract` to be at most 45 (too many false positives)
  // * bit 11 (UTF-8) when a string byte exceeds 0x7F (this could also be CP437)
  assert(Buffer.isBuffer(buffer));
  if (buffer.length < 22) {
    throw new Error('zip file too small (minimum size is 22 bytes)');
  }
  if (buffer.length > Math.pow(2, 32) - 1) {
    throw new Error('unsupported: zip file exceeds 4 GB limit (ZIP64)');
  }
  var signature = buffer.toString('hex', 0, 6);
  if (signature.indexOf('526172211a07') === 0) {
    throw new Error('not a zip file (malicious rar)');
  }
  if (signature.indexOf('78617221') === 0) {
    throw new Error('not a zip file (malicious xar)');
  }
  if (signature.indexOf('7573746172') === 0) {
    throw new Error('not a zip file (malicious tar)');
  }
  var eocdrOffset = self.findEndOfCentralDirectoryRecord(buffer);
  if (eocdrOffset === -1) throw new Error('no end of central directory record');
  var eocdr = self.decodeHeaderEndOfCentralDirectoryRecord(buffer, eocdrOffset);
  self.assertUInt32(eocdr.length);
  if (eocdrOffset + eocdr.length !== buffer.length) {
    var eocdrAppended = buffer.length - eocdr.length - eocdrOffset;
    assert(eocdrAppended > 0);
    var eocdrZeroed = self.zeroed(
      buffer,
      eocdrOffset + eocdr.length,
      eocdrAppended
    );
    throw new Error(
      'zip file has appended data' + (eocdrZeroed ? ' (zeroed)' : '') + ': ' +
      self.bytes(eocdrAppended)
    );
  }
  self.assertUInt32(eocdr.centralDirectoryRecords);
  self.assertUInt32(eocdr.centralDirectoryOffset);
  self.assertUInt32(eocdr.centralDirectorySize);
  var sumCompressedSizes = 0;
  var sumUncompressedSizes = 0;
  var headers = [];
  var records = eocdr.centralDirectoryRecords;
  var centralOffset = eocdr.centralDirectoryOffset;
  var localOffset = self.assertFirstSignature(buffer, records);
  assert(localOffset === 0 || localOffset === 4);
  while (records--) {
    var header = self.decodeHeaderCentralDirectoryFile(buffer, centralOffset);
    var local = self.decodeHeaderLocalFile(buffer, header.relativeOffset);
    self.assertLocalFileMatchesCentralDirectoryFile(local, header);
    if (header.relativeOffset < localOffset) {
      throw new Error('zip file has overlap between local files');
    }
    if (header.relativeOffset > localOffset) {
      throw new Error('zip file has gap between local files');
    }
    localOffset += local.length;
    localOffset += header.compressedSize;
    if (localOffset > buffer.length) throw new Error('file data overflow');
    if (local.generalPurposeBitFlag & (1 << 3)) {
      var descriptor = self.decodeHeaderDataDescriptor(buffer, localOffset);
      self.assertDataDescriptorMatchesCentralDirectoryFile(descriptor, header);
      localOffset += descriptor.length;
    }
    headers.push(header);
    centralOffset += header.length;
    sumCompressedSizes += header.compressedSize;
    sumUncompressedSizes += header.uncompressedSize;
  }
  if (eocdr.centralDirectoryOffset < localOffset) {
    throw new Error(
      'zip file has overlap between last local file and central directory'
    );
  }
  if (eocdr.centralDirectoryOffset > localOffset) {
    throw new Error(
      'zip file has gap between last local file and central directory'
    );
  }
  self.assertUInt32(centralOffset);
  self.assertUInt32(eocdr.centralDirectoryOffset);
  self.assertUInt32(eocdr.centralDirectorySize);
  var expect = eocdr.centralDirectoryOffset + eocdr.centralDirectorySize;
  if (centralOffset < expect) {
    if (self.zeroed(buffer, centralOffset, expect - centralOffset)) {
      throw new Error('central directory underflow (zeroed)');
    } else {
      throw new Error('central directory underflow');
    }
  }
  if (centralOffset > expect) throw new Error('central directory overflow');
  assert(centralOffset <= eocdrOffset);
  if (buffer.readUInt32LE(centralOffset) === 0x06064b50) {
    throw new Error('unsupported: zip64 end of central directory record');
  }
  if (centralOffset !== eocdrOffset) {
    throw new Error(
      'zip file has gap between central directory and ' +
      'end of central directory record'
    );
  }
  assert(centralOffset + eocdr.length === buffer.length);
  self.assertUInt32(sumCompressedSizes);
  self.assertUInt32(sumUncompressedSizes);
  var ratio = Math.round(
    sumUncompressedSizes / Math.max(1, sumCompressedSizes)
  );
  self.assertUInt32(ratio);
  if (ratio > 100) throw new Error('zip bomb (ratio=' + ratio + ')');
  return headers;
};

ZIP.decodeHeader = function(buffer, offset, layout) {
  var self = this;
  assert(Buffer.isBuffer(buffer));
  assert(offset >= 0 && offset < buffer.length);
  var type = layout[0];
  var signature = layout[1];
  var minimum = layout[2];
  assert(typeof type === 'string');
  self.assertUInt32(signature);
  self.assertUInt32(minimum);
  assert(minimum > 0 && minimum < 64);
  if (offset + 4 > buffer.length) {
    throw new Error(type + ': signature overflow');
  }
  if (offset + minimum > buffer.length) {
    throw new Error(type + ': minimum overflow');
  }
  if (buffer.readUInt32LE(offset) !== signature) {
    throw new Error(
      type + ': signature mismatch: ' +
      JSON.stringify(buffer.toString('hex', offset, offset + 4))
    );
  }
  var relative = 4;
  var header = {};
  for (var index = 3; index < layout.length; index++) {
    var size = layout[index][0];
    var name = layout[index][1];
    assert(size === 2 || size === 4);
    assert(typeof name === 'string');
    if (size === 2) {
      header[name] = buffer.readUInt16LE(offset + relative);
      if (header[name] === 0xFFFF) throw new Error('unsupported: zip64');
    } else {
      header[name] = buffer.readUInt32LE(offset + relative);
      if (header[name] === 0xFFFFFFFF) throw new Error('unsupported: zip64');
    }
    relative += size;
  }
  assert(relative === minimum);
  header.length = minimum;
  if (header.hasOwnProperty('fileNameLength')) {
    header.fileName = self.decodeString(
      'file name',
      buffer,
      offset + header.length,
      header.fileNameLength,
      header
    );
    header.length += header.fileNameLength;
  }
  if (header.hasOwnProperty('extraFieldLength')) {
    header.extraField = self.slice(
      buffer,
      offset + header.length,
      header.extraFieldLength
    );
    header.length += header.extraFieldLength;
  }
  if (header.hasOwnProperty('fileCommentLength')) {
    header.fileComment = self.decodeString(
      'file comment',
      buffer,
      offset + header.length,
      header.fileCommentLength,
      header
    );
    header.length += header.fileCommentLength;
  }
  if (header.hasOwnProperty('commentLength')) {
    // The End Of Central Directory Record comment must always be CP437 since
    // the record has no general purpose bit flag to indicate UTF-8:
    assert(type === 'end of central directory record');
    header.comment = self.decodeString(
      'zip comment',
      buffer,
      offset + header.length,
      header.commentLength,
      undefined
    );
    header.length += header.commentLength;
  }
  self.assertUInt32(header.length);
  if (offset + header.length > buffer.length) {
    throw new Error(type + ': overflow');
  }
  if (header.length > 65535) {
    throw new Error(type + ': header length exceeds 65535 bytes');
  }
  return header;
};

ZIP.decodeHeaderCentralDirectoryFile = function(buffer, offset) {
  var self = this;
  var header = self.decodeHeader(buffer, offset, [
    'central directory file',
    0x02014b50,
    46,
    [2, 'versionMade'],
    [2, 'versionMinimum'],
    [2, 'generalPurposeBitFlag'],
    [2, 'compressionMethod'],
    [2, 'lastModFileTime'],
    [2, 'lastModFileDate'],
    [4, 'crc32'],
    [4, 'compressedSize'],
    [4, 'uncompressedSize'],
    [2, 'fileNameLength'],
    [2, 'extraFieldLength'],
    [2, 'fileCommentLength'],
    [2, 'disk'],
    [2, 'internalFileAttributes'],
    [4, 'externalFileAttributes'],
    [4, 'relativeOffset']
  ]);
  self.assertGeneralPurposeBitFlag(header.generalPurposeBitFlag);
  self.assertCompressionMethod(header.compressionMethod);
  self.assertTime(header.lastModFileTime);
  self.assertDate(header.lastModFileDate);
  self.assertCompressionMethodSizes(
    header.compressionMethod,
    header.compressedSize,
    header.uncompressedSize
  );
  self.assertFileNameLength(header.fileNameLength);
  self.assertExtraFieldLength(header.extraFieldLength);
  self.assertDisk(header.disk);
  self.assertFileName(header.fileName);
  self.assertExtraField(header);
  if (
    (header.externalFileAttributes & 0x0010) ||
    (header.fileName[header.fileName.length - 1] === '/')
  ) {
    header.directory = 1;
    if (header.compressedSize !== 0) {
      throw new Error(
        'directory has compressed size=' + header.compressedSize
      );
    }
    if (header.uncompressedSize !== 0) {
      throw new Error(
        'directory has uncompressed size=' + header.uncompressedSize
      );
    }
  } else {
    header.directory = 0;
  }
  if ((header.versionMade >>> 8) === 3) {
    header.mode = (header.externalFileAttributes >>> 16) & 0xFFFF;
  } else {
    header.mode = 0;
  }
  if (header.relativeOffset + 30 + header.compressedSize > offset) {
    throw new Error('local file header and data overlaps central directory');
  }
  // Detect malicious symlinks:
  if ((header.mode & 61440) === 40960) {
    if (header.compressionMethod !== 0) {
      throw new Error('unsupported: compressed symlink');
    }
    if (header.compressedSize > 1024) {
      throw new Error('unsupported: symlink value exceeds 1024 bytes');
    }
    var local = self.decodeHeaderLocalFile(buffer, header.relativeOffset);
    self.assertLocalFileMatchesCentralDirectoryFile(local, header);
    self.assertSymlink(
      header.fileName,
      buffer.toString(
        'utf-8',
        header.relativeOffset + local.length,
        header.relativeOffset + local.length + header.compressedSize
      )
    );
  }
  assert(
    header.length === (
      46 +
      header.fileNameLength +
      header.extraFieldLength +
      header.fileCommentLength
    )
  );
  return header;
};

ZIP.decodeHeaderDataDescriptor = function(buffer, offset) {
  var self = this;
  if (offset + 16 > buffer.length) throw new Error('data descriptor: overflow');
  var header = {};
  header.length = 12;
  // The data descriptor signature is optional:
  if (buffer.readUInt32LE(offset) === 0x08074b50) {
    offset += 4;
    header.length += 4;
  }
  header.crc32 = buffer.readUInt32LE(offset + 0);
  header.compressedSize = buffer.readUInt32LE(offset + 4);
  header.uncompressedSize = buffer.readUInt32LE(offset + 8);
  return header;
};

ZIP.decodeHeaderEndOfCentralDirectoryRecord = function(buffer, offset) {
  var self = this;
  var header = self.decodeHeader(buffer, offset, [
    'end of central directory record',
    0x06054b50,
    22,
    [2, 'disk'                       ],
    [2, 'centralDirectoryDisk'       ],
    [2, 'centralDirectoryDiskRecords'],
    [2, 'centralDirectoryRecords'    ],
    [4, 'centralDirectorySize'       ],
    [4, 'centralDirectoryOffset'     ],
    [2, 'commentLength'              ]
  ]);
  self.assertDisk(header.disk);
  self.assertDisk(header.centralDirectoryDisk);
  if (header.centralDirectoryDiskRecords !== header.centralDirectoryRecords) {
    throw new Error(
      'central directory disk records = ' + header.centralDirectoryDiskRecords +
      ' !== central directory records = ' + header.centralDirectoryRecords
    );
  }
  if (header.centralDirectorySize < header.centralDirectoryRecords * 46) {
    throw new Error('central directory size insufficient for records');
  }
  if (header.centralDirectoryOffset + header.centralDirectorySize > offset) {
    throw new Error(
      'central directory overlaps end of central directory record'
    );
  }
  assert(header.length === 22 + header.commentLength);
  return header;
};

ZIP.decodeHeaderLocalFile = function(buffer, offset) {
  var self = this;
  var header = self.decodeHeader(buffer, offset, [
    'local file',
    0x04034b50,
    30,
    [2, 'versionMinimum'       ],
    [2, 'generalPurposeBitFlag'],
    [2, 'compressionMethod'    ],
    [2, 'lastModFileTime'      ],
    [2, 'lastModFileDate'      ],
    [4, 'crc32'                ],
    [4, 'compressedSize'       ],
    [4, 'uncompressedSize'     ],
    [2, 'fileNameLength'       ],
    [2, 'extraFieldLength'     ]
  ]);
  self.assertGeneralPurposeBitFlag(header.generalPurposeBitFlag);
  self.assertCompressionMethod(header.compressionMethod);
  self.assertTime(header.lastModFileTime);
  self.assertDate(header.lastModFileDate);
  self.assertCompressionMethodSizes(
    header.compressionMethod,
    header.compressedSize,
    header.uncompressedSize
  );
  if (header.generalPurposeBitFlag & (1 << 3)) {
    if (header.crc32 !== 0) {
      throw new Error('local file: bit 3, crc32 must be 0');
    }
    // The un/compressed sizes may be non-zero when there is no compression:
    if (header.compressedSize !== 0 && header.compressionMethod !== 0) {
      throw new Error('local file: bit 3, compressed size must be 0');
    }
    if (header.uncompressedSize !== 0 && header.compressionMethod !== 0) {
      throw new Error('local file: bit 3, uncompressed size must be 0');
    }
  }
  self.assertFileNameLength(header.fileNameLength);
  self.assertExtraFieldLength(header.extraFieldLength);
  self.assertFileName(header.fileName);
  self.assertExtraField(header);
  assert(
    header.length === 30 + header.fileNameLength + header.extraFieldLength
  );
  return header;
};

ZIP.decodeString = function(name, buffer, offset, size, header) {
  var self = this;
  assert(typeof name === 'string');
  assert(Buffer.isBuffer(buffer));
  self.assertUInt32(offset);
  self.assertUInt32(size);
  if (header !== undefined) self.assertUInt32(header.generalPurposeBitFlag);
  if (size > 16384) throw new Error(name + ' size exceeds 16384 bytes');
  if (offset + size > buffer.length) throw new Error(name + ' overflow');
  for (var index = offset, length = offset + size; index < length; index++) {
    if (buffer[index] === 0) {
      throw new Error(name + ' contains null bytes');
    }
  }
  // Some systems such as macOS never bother to set bit 11 to indicate utf-8.
  // We therefore always attempt utf-8 and fallback to CP437 only on error.
  // TO DO: Switch to TextDecoder when we upgrade Node.
  return buffer.toString('utf-8', offset, offset + size);
  // try {
  //   var textDecoder = new TextDecoder('utf-8', { fatal: true });
  //   return textDecoder.decode(buffer.slice(offset, offset + size));
  // } catch (error) {
  //   // If the string is supposed to be utf-8 then reject the string as invalid:
  //   var utf8 = header && (header.generalPurposeBitFlag & (1 << 11));
  //   if (utf8) throw new Error(name + ' contains invalid utf-8');
  // }
  // // CP437:
  // var string = '';
  // for (var index = offset, length = offset + size; index < length; index++) {
  //   var code = buffer[index];
  //   if (code < 128) {
  //     string += String.fromCharCode(code);
  //   } else {
  //     string += self.decodeStringCP437[code - 128];
  //   }
  // }
  // return string;
};

ZIP.decodeStringCP437 = (
  'ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐' +
  '└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ '
);
assert(ZIP.decodeStringCP437.length === 256 - 128);

ZIP.findEndOfCentralDirectoryRecord = function(buffer) {
  var self = this;
  assert(Buffer.isBuffer(buffer));
  if (buffer.length < 22) return -1;
  var index = Math.max(0, buffer.length - 22);
  var floor = Math.max(0, buffer.length - 22 - 65535);
  while (index >= floor) {
    // Optimize branch prediction (a byte is cheaper than a function call):
    if (buffer[index] === 0x50 && buffer.readUInt32LE(index) === 0x06054b50) {
      return index;
    }
    index--;
  }
  return -1;
};

ZIP.findShift = function(buffer, signature) {
  var self = this;
  assert(Buffer.isBuffer(buffer));
  assert(signature === 0x04034b50 || signature === 0x02014b50);
  var index = 0;
  var length = Math.min(Math.max(0, buffer.length - 4), 1024);
  while (index < length) {
    if (buffer[index] === 0x50 && buffer.readUInt32LE(index) === signature) {
      return index;
    }
    index++;
  }
  return -1;
};

ZIP.inflate = function(header, buffer) {
  var self = this;
  // Check that header is a central directory file and not a local file:
  self.assertUInt32(header.versionMade);
  self.assertUInt32(header.relativeOffset);
  self.assertCompressionMethodSizes(
    header.compressionMethod,
    header.compressedSize,
    header.uncompressedSize
  );
  assert(Buffer.isBuffer(buffer));
  var local = self.decodeHeaderLocalFile(buffer, header.relativeOffset);
  self.assertLocalFileMatchesCentralDirectoryFile(local, header);
  var offset = header.relativeOffset + local.length;
  self.assertUInt32(offset);
  if (offset + header.compressedSize > buffer.length) {
    throw new Error('buffer overflow');
  }
  if (header.compressionMethod === 0) {
    var target = Buffer.alloc(header.compressedSize);
    var copied = buffer.copy(target, 0, offset, offset + header.compressedSize);
    assert(copied === header.uncompressedSize);
    assert(copied === target.length);
    return target;
  } else if (header.compressionMethod === 8) {
    // TO DO: inflateRaw() must limit maximum uncompressed size to avoid a DoS.
    // https://github.com/nodejs/node/issues/27253
    var target = Node.zlib.inflateRawSync(
      buffer.slice(offset, offset + header.compressedSize)
    );
    if (target.length !== header.uncompressedSize) {
      throw new Error(
        'final inflated size diverges from header uncompressed size: ' +
        target.length + ' vs ' + header.uncompressedSize
      );
    }
    return target;
  } else {
    throw new Error(
      'unsupported: compression method=' + header.compressionMethod
    );
  }
};

ZIP.slice = function(buffer, offset, size) {
  var self = this;
  assert(Buffer.isBuffer(buffer));
  self.assertUInt32(offset);
  self.assertUInt32(size);
  if (offset + size > buffer.length) throw new Error('slice overflow');
  return buffer.slice(offset, offset + size);
};

ZIP.verify = function(header, data) {
  var self = this;
  self.assertUInt32(header.crc32);
  self.assertUInt32(header.versionMade);
  self.assertUInt32(header.relativeOffset);
  self.assertCompressionMethodSizes(
    header.compressionMethod,
    header.compressedSize,
    header.uncompressedSize
  );
  assert(Buffer.isBuffer(data));
  assert(data.length === header.uncompressedSize);
  return CRC32(data) === header.crc32;
};

ZIP.zeroed = function(buffer, offset, size) {
  var self = this;
  assert(Buffer.isBuffer(buffer));
  self.assertUInt32(offset);
  self.assertUInt32(size);
  var length = offset + size;
  assert(length <= buffer.length);
  while (offset < length) if (buffer[offset++] !== 0) return false;
  return true;
};

module.exports = ZIP;
