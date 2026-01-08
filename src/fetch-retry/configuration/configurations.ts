import { DefaultRetryConfiguration } from './default-retry-configuration';
import { NoRetryConfiguration } from './no-retry-configuration';
import type { RetryConfiguring } from './retry-configuring';

export class RetryConfigs {
  static readonly default: Readonly<RetryConfiguring> =
    DefaultRetryConfiguration.shared;

  static readonly noRetry: Readonly<RetryConfiguring> =
    NoRetryConfiguration.shared;
}
