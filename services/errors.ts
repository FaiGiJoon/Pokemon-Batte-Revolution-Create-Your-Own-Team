// Custom error classes for more specific error handling.

export class FileProcessingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FileProcessingError';
  }
}

export class EmptyFileError extends FileProcessingError {
  constructor(message: string = "The selected file is empty.") {
    super(message);
    this.name = 'EmptyFileError';
  }
}

export class CorruptedDataError extends FileProcessingError {
  constructor(message: string = "The file appears to be corrupted or in an unrecognized format.") {
    super(message);
    this.name = 'CorruptedDataError';
  }
}