/** dsh-produced-file-paths host entry types. */
import type { Context } from '@deepseek-ai/cordis';

export interface ProducedFilePathsConfig {
  /** Reserved for future configuration. */
}

export declare const name = 'dsh-produced-file-paths';
export declare function apply(ctx: Context, config?: ProducedFilePathsConfig): void;
