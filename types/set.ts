type PlannedSet = {
  weight?: number;
  reps?: number;
  logged: boolean;
  /**
   * Type of set. (`undefined` if default straight set).
   */
  type?: SetType;
  setOrder: number;
  parentSetOrder?: number;
};

/**
 * Types of sets that are not default straight sets.
 * @example
 * // W: Warm-up set
 * // GS: Giant set
 * // DS: Drop set
 * // MM: Myorep match set
 */
type SetType = "W" | "GS" | "DS" | "MM";
