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

import { OverlayTemplate } from '@numlemon/klinecharts'

const positionPrice: OverlayTemplate = {
  name: 'positionPrice',
  // totalStep: 2,
  createPointFigures: ({ bounding, coordinates, overlay, precision }) => {
    const { extendData } = overlay
    let text, price, color;
    if (isValid(extendData.color)) {
      color = extendData.color
    } else {
      color = 'blue'
    }
    if (isValid(extendData.text)) {
      text = extendData.text
    } else {
      text = ''
    }
    if (isValid(extendData.price)) {
      price = extendData.price
    } else {
      price = ''
    }
    if (isValid(price)) {
      price = formatPrecision(price, precision.price)
    }
    return [
      {
        type: 'line',
        attrs: {
          coordinates: [
            { x: 0, y: coordinates[0].y },
            { x: bounding.width, y: coordinates[0].y }
          ]
        },
        ignoreEvent: true,
      },
      {
        type: 'rectText',
        attrs: {
          x: bounding.width,
          y: coordinates[0].y,
          text: text ?? '',
          align: 'end',
          baseline: 'middle',
        },
        ignoreEvent: true,
      },
    ]
  },
}

function formatPrecision(value: string | number, precision?: number): string {
  const v = +value
  if (isNumber(v)) {
    return v.toFixed(precision ?? 2)
  }
  return `${value}`
}

function isNumber(value: any): value is number {
  return typeof value === 'number' && !isNaN(value)
}

function isValid<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}

export default positionPrice
