/**
 * Property-Based Testing Suite
 */
export class PropertyTester {
  static testProperty1_CreateDelete(vfs, path) {
    const initialFilesCount = vfs.files.size;
    vfs.writeFile(path, 'test');
    vfs.deleteFile(path);
    return vfs.files.size === initialFilesCount;
  }

  static testProperty3_SerializeDeserialize(data) {
    const serialized = JSON.stringify(data);
    const deserialized = JSON.parse(serialized);
    return JSON.stringify(data) === JSON.stringify(deserialized);
  }
}
