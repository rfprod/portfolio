/**
 * Tree node with nested structure.
 */
export interface TreeNode {
  name: string; // profile + app node
  link?: string; // profile node
  imgRef?: string; // profile + app node
  tag?: string; // app node
  urls?: {
    repo: string;
    web: string;
    android: string;
  } // app node
  children?: TreeNode[];
}

/**
 * Flat node with expandable and level information
 */
export interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
}
