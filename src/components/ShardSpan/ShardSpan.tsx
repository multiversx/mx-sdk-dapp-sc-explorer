import React from 'react';
import { getShardText } from 'lib';

export interface ShardSpanPropsType {
  shard: number | string;
  ['data-testid']?: string;
}

export const ShardSpan = ({ shard, ...rest }: ShardSpanPropsType) => (
  <span {...rest}>{getShardText(shard)}</span>
);
