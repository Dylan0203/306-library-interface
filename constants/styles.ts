/**
 * Shared Tailwind CSS utility class combinations
 * Used across multiple components for consistency
 */

// Card Styles
/** Base card styling with background, border, and shadow */
export const CARD_BASE =
  "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm";

/** Card hover effects with shadow and transform */
export const CARD_HOVER =
  "hover:shadow-md transition-all duration-200 hover:-translate-y-0.5";

/** Skeleton card for loading states */
export const SKELETON_CARD =
  "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm";

// Button Styles
export const BTN_BASE =
  "inline-block px-5 py-2.5 text-sm font-medium text-center border-0 rounded-lg cursor-pointer transition-all duration-200 w-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
export const BTN_PRIMARY =
  "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md";
export const BTN_SECONDARY = "bg-gray-500 text-white hover:bg-gray-600";

// Modal Styles
export const MODAL_OVERLAY =
  "fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4";
export const MODAL_CONTENT =
  "bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto";
export const MODAL_HEADER =
  "flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700";
export const MODAL_BODY = "p-4";
export const MODAL_FOOTER =
  "p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3";
export const MODAL_CLOSE =
  "bg-transparent border-0 text-2xl leading-none text-gray-500 dark:text-gray-400 cursor-pointer p-0 w-8 h-8 flex items-center justify-center rounded transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2";

// Form Styles
export const FORM_GROUP = "mb-4";
export const FORM_LABEL =
  "block mb-2 font-medium text-gray-900 dark:text-white";
export const FORM_INPUT =
  "w-full px-3 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-lg transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:ring-offset-2";
export const FORM_ERROR = "text-red-600 dark:text-red-400 text-sm mt-1";
export const FORM_ACTIONS = "flex gap-3 mt-6";

// Toast Styles
export const TOAST_BASE =
  "fixed top-4 right-4 min-w-[300px] max-w-lg px-6 py-4 rounded-lg shadow-lg z-[2000] flex items-center justify-between gap-4";
export const TOAST_SUCCESS = "bg-green-600 text-white";
export const TOAST_ERROR = "bg-red-600 text-white";
export const TOAST_MESSAGE = "m-0 flex-1 font-medium";
export const TOAST_CLOSE =
  "bg-transparent border-0 text-white text-2xl leading-none cursor-pointer p-0 w-6 h-6 flex items-center justify-center rounded transition-opacity duration-200 hover:opacity-80";

// State Styles
export const EMPTY_STATE =
  "text-center py-12 bg-white dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700";
export const EMPTY_STATE_TEXT = "text-lg text-gray-600 dark:text-gray-300";

export const ERROR_MESSAGE =
  "bg-red-50 dark:bg-red-900/20 border border-red-400 dark:border-red-600 rounded-lg p-4 mb-4 text-red-800 dark:text-red-200";

// Text Utilities
export const TEXT_ERROR = "text-red-600 dark:text-red-400";
export const TEXT_SUCCESS = "text-green-600 dark:text-green-400";
export const TEXT_LIGHT = "text-gray-500 dark:text-gray-400";
