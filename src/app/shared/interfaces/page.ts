export interface Page<T> {
  content: T[];             // The list of items on the current page
  totalPages: number;       // Total number of pages
  totalElements: number;    // Total number of elements across all pages
  size: number;             // The size of the page (number of items per page)
  number: number;           // The current page number (0-indexed)
  first: boolean;           // Whether this is the first page
  last: boolean;            // Whether this is the last page
  numberOfElements: number; // Number of elements on the current page
  empty: boolean;           // Whether the page is empty
}
