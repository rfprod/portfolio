/**
 * Tree node with nested structure.
 */
export interface TreeNode {
  name: string; // Profile + app node
  link?: string; // Profile node
  imgRef?: string; // Profile + app node
  tag?: string; // App node
  urls?: {
    repo: string;
    web: string;
    android: string;
  }; // App node
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
