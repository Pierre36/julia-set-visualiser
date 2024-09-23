export interface JsonSerialisable {
  /**
   * Convert an object to its JSON representation
   *
   * @returns the JSON object
   */
  toJSON(): any;
}

export interface JsonSerialisableStatic {
  /**
   * Create an object from its JSON representation
   *
   * @param json the JSON to deserialise
   * @returns the object or `undefined` if the JSON is invalid
   */
  fromJSON(json: any): JsonSerialisable | undefined;
}
