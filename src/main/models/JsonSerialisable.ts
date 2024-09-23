export interface JsonSerialisable {
  /**
   * Convert an object to its JSON representation
   *
   * @returns the JSON object
   */
  toJSON(): any;
}
