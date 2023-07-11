/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, from } from 'solid-js';

import type { SelectDataSourceItem } from '../../../components';
import abcd from './abcd';
import anyWaves from './anyWaves';
import arrow from './arrow';
import circle from './circle';
import eightWaves from './eightWaves';
import fibonacciCircle from './fibonacciCircle';
import fibonacciExtension from './fibonacciExtension';
import fibonacciLine from './fibonacciLine';
import fibonacciSegment from './fibonacciSegment';
import fibonacciSpeedResistanceFan from './fibonacciSpeedResistanceFan';
import fibonacciSpiral from './fibonacciSpiral';
import fiveWaves from './fiveWaves';
import gannBox from './gannBox';
import horizontalRayLine from './horizontalRayLine';
import horizontalSegment from './horizontalSegment';
import horizontalStraightLine from './horizontalStraightLine';
import i18n from '../../../i18n';
import invisible from './invisible';
import lock from './lock';
import measure from './measure';
import parallelStraightLine from './parallelStraightLine';
import parallelogram from './parallelogram';
import priceChannelLine from './priceChannelLine';
import priceLine from './priceLine';
import rayLine from './rayLine';
import rect from './rect';
import remove from './remove';
import segment from './segment';
import straightLine from './straightLine';
import strongMagnet from './strongMagnet';
import threeWaves from './threeWaves';
import triangle from './triangle';
import unlock from './unlock';
import verticalRayLine from './verticalRayLine';
import verticalSegment from './verticalSegment';
import verticalStraightLine from './verticalStraightLine';
import visible from './visible';
import weakMagnet from './weakMagnet';
import xabcd from './xabcd';

export const mapping = {
  horizontalStraightLine,
  horizontalRayLine,
  horizontalSegment,
  verticalStraightLine,
  verticalRayLine,
  verticalSegment,
  straightLine,
  rayLine,
  segment,
  arrow,
  priceLine,
  priceChannelLine,
  parallelStraightLine,
  fibonacciLine,
  fibonacciSegment,
  fibonacciCircle,
  fibonacciSpiral,
  fibonacciSpeedResistanceFan,
  fibonacciExtension,
  gannBox,
  circle,
  triangle,
  rect,
  parallelogram,
  threeWaves,
  fiveWaves,
  eightWaves,
  anyWaves,
  abcd,
  xabcd,
  weak_magnet: weakMagnet,
  strong_magnet: strongMagnet,
  lock,
  unlock,
  visible,
  invisible,
  remove,
  measure,
};

export function createSingleLineOptions(
  locale: string
): SelectDataSourceItem[] {
  return [
    {
      key: 'horizontalStraightLine',
      text: i18n('horizontal_straight_line', locale),
    },
    { key: 'horizontalRayLine', text: i18n('horizontal_ray_line', locale) },
    { key: 'horizontalSegment', text: i18n('horizontal_segment', locale) },
    {
      key: 'verticalStraightLine',
      text: i18n('vertical_straight_line', locale),
    },
    { key: 'verticalRayLine', text: i18n('vertical_ray_line', locale) },
    { key: 'verticalSegment', text: i18n('vertical_segment', locale) },
    { key: 'straightLine', text: i18n('straight_line', locale) },
    { key: 'rayLine', text: i18n('ray_line', locale) },
    { key: 'segment', text: i18n('segment', locale) },
    { key: 'arrow', text: i18n('arrow', locale) },
    { key: 'priceLine', text: i18n('price_line', locale) },
  ];
}

export function createMoreLineOptions(locale: string): SelectDataSourceItem[] {
  return [
    { key: 'priceChannelLine', text: i18n('price_channel_line', locale) },
    {
      key: 'parallelStraightLine',
      text: i18n('parallel_straight_line', locale),
    },
  ];
}

export function createPolygonOptions(locale: string): SelectDataSourceItem[] {
  return [
    { key: 'circle', text: i18n('circle', locale) },
    { key: 'rect', text: i18n('rect', locale) },
    { key: 'parallelogram', text: i18n('parallelogram', locale) },
    { key: 'triangle', text: i18n('triangle', locale) },
  ];
}

export function createFibonacciOptions(locale: string): SelectDataSourceItem[] {
  return [
    { key: 'fibonacciLine', text: i18n('fibonacci_line', locale) },
    { key: 'fibonacciSegment', text: i18n('fibonacci_segment', locale) },
    { key: 'fibonacciCircle', text: i18n('fibonacci_circle', locale) },
    { key: 'fibonacciSpiral', text: i18n('fibonacci_spiral', locale) },
    {
      key: 'fibonacciSpeedResistanceFan',
      text: i18n('fibonacci_speed_resistance_fan', locale),
    },
    { key: 'fibonacciExtension', text: i18n('fibonacci_extension', locale) },
    { key: 'gannBox', text: i18n('gann_box', locale) },
  ];
}

export function createWaveOptions(locale: string): SelectDataSourceItem[] {
  return [
    { key: 'xabcd', text: i18n('xabcd', locale) },
    { key: 'abcd', text: i18n('abcd', locale) },
    { key: 'threeWaves', text: i18n('three_waves', locale) },
    { key: 'fiveWaves', text: i18n('five_waves', locale) },
    { key: 'eightWaves', text: i18n('eight_waves', locale) },
    { key: 'anyWaves', text: i18n('any_waves', locale) },
  ];
}

export function createMagnetOptions(locale: string): SelectDataSourceItem[] {
  return [
    { key: 'weak_magnet', text: i18n('weak_magnet', locale) },
    { key: 'strong_magnet', text: i18n('strong_magnet', locale) },
  ];
}

interface IconProps {
  class?: string;
  name: string;
}

export const Icon: Component<IconProps> = (props) =>
  // @ts-expect-error
  mapping[props.name](props.class);
