/* tslint:disable */
/* eslint-disable */
/**
*/
export class Calculator {
  free(): void;
/**
* A calculator is initialized by defining the year range. Note that
* start and end year are included. All input parameters will be
* initialized as zero.
* @param {number} start_year
* @param {number} end_year
* @returns {Calculator}
*/
  static new(start_year: number, end_year: number): Calculator;
/**
* This function serves to trigger the calculation process.
*/
  calculate_over_years(): void;
/**
* Returns the ids of all input parameters.
* @returns {any}
*/
  list_input_ids(): any;
/**
* @param {string} id
* @returns {Float64Array}
*/
  get_input_values(id: string): Float64Array;
/**
* This function serves to populate the input parameters.
*
* Note that "set input" means the start year value of an input parameter.
* @param {string} id
* @param {number} value
*/
  set_input(id: string, value: number): void;
/**
* This function returns the start year value of an input parameter.
* @param {string} id
* @returns {number | undefined}
*/
  get_input(id: string): number | undefined;
/**
* Returns the ids of all results.
* @returns {any}
*/
  list_result_ids(): any;
/**
* Get a list of values (for each year) in a result.
* @param {string} id
* @returns {Float64Array}
*/
  get_results(id: string): Float64Array;
/**
* Add a new measure to a input (given by an input id).
* start and end year defines the year range for which the measure applies.
*
* Note that start year is included.
*
* The delta defines by how much the input parameter is changed over the given range of years.
* The change is applied linear.
*
* I.e. if the number of cars is about to be reduced by 200 from 2025 to
* 2026 and there are 1200 cars in the calculator start year 2023 the
* values for n_cars will be:
*
* 2023->1200, 2024->1200, 2025->1100, 2026->1000, 2027->1000...
* @param {string} id
* @param {string} input_id
* @param {number} start_year
* @param {number} end_year
* @param {number} delta
*/
  new_measure(id: string, input_id: string, start_year: number, end_year: number, delta: number): void;
/**
* For changing the start_year, end_year or delta of a given measure.
* Note that even if one of the does not change, all must be given.
* @param {string} id
* @param {string} input_id
* @param {number} start_year
* @param {number} end_year
* @param {number} delta
*/
  update_measure(id: string, input_id: string, start_year: number, end_year: number, delta: number): void;
/**
* Deleting a measure. Note that this updates the values of the
* corresponding input.
* @param {string} id
* @param {string} input_id
*/
  delete_measure(id: string, input_id: string): void;
/**
* List all measure ids that are present in the current calculator.
* @returns {any}
*/
  list_measure_ids(): any;
/**
*/
  end_year: number;
/**
*/
  start_year: number;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_calculator_free: (a: number) => void;
  readonly __wbg_get_calculator_start_year: (a: number) => number;
  readonly __wbg_set_calculator_start_year: (a: number, b: number) => void;
  readonly __wbg_get_calculator_end_year: (a: number) => number;
  readonly __wbg_set_calculator_end_year: (a: number, b: number) => void;
  readonly calculator_new: (a: number, b: number) => number;
  readonly calculator_calculate_over_years: (a: number) => void;
  readonly calculator_list_input_ids: (a: number) => number;
  readonly calculator_get_input_values: (a: number, b: number, c: number, d: number) => void;
  readonly calculator_set_input: (a: number, b: number, c: number, d: number) => void;
  readonly calculator_get_input: (a: number, b: number, c: number, d: number) => void;
  readonly calculator_list_result_ids: (a: number) => number;
  readonly calculator_get_results: (a: number, b: number, c: number, d: number) => void;
  readonly calculator_new_measure: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => void;
  readonly calculator_update_measure: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => void;
  readonly calculator_delete_measure: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly calculator_list_measure_ids: (a: number) => number;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
