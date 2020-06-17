import $ from "jquery";

/**
 **
 *** AUX FUNCTIONS ***
 **
 */
export function checkValidField(value: string): boolean {
  return value !== undefined && value !== "" && value !== null;
}

export function disableInputField(fieldId: string, enabled: boolean): void {
  $(`#${fieldId}`).prop("disabled", enabled);
}
