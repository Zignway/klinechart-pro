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

import { OverlayTemplate, utils } from 'klinecharts'

import { getRotateCoordinate } from './utils'

let count = 0

const culuateText = (upperPrice: number | undefined, lowerPrice: number | undefined, precision: any, thousandsSeparator: any) => {
  if (!upperPrice || !lowerPrice) return ''
  const priceDiff = upperPrice - lowerPrice
  const priceDiffPercent = (priceDiff / lowerPrice) * 100
  return `${utils.formatThousands(+utils.formatPrecision(priceDiff, precision.price), thousandsSeparator)} (${utils.formatPrecision(priceDiffPercent, 2)}%)`
}

const measure: OverlayTemplate = {
  name: 'measure',
  totalStep: 3,
  needDefaultPointFigure: true,
  needDefaultXAxisFigure: true,
  needDefaultYAxisFigure: true,
  styles: {},
  createPointFigures: ({
    overlay: { points },
    coordinates,
    precision,
    thousandsSeparator, }) => {
    let text = '';
    if (coordinates.length > 1) {
      const colorBlue = '#2962ff', colorRed = '#d50000'
      const arrowX = (Math.abs(coordinates[0].x - coordinates[1].x) / 2) + Math.min(coordinates[0].x, coordinates[1].x)
      const arrowY = (Math.abs(coordinates[0].y - coordinates[1].y) / 2) + Math.min(coordinates[0].y, coordinates[1].y)
      if (coordinates[0].y > coordinates[1].y) {
        if (points.length === 2) {
          const upperPrice = points[1].value
          const lowerPrice = points[0].value
          text = culuateText(upperPrice, lowerPrice, precision, thousandsSeparator)
        }
        return [
          {
            type: 'polygon',
            attrs: {
              coordinates: [
                coordinates[0],
                { x: coordinates[1].x, y: coordinates[0].y },
                coordinates[1],
                { x: coordinates[0].x, y: coordinates[1].y }
              ]
            },
            styles: {
              color: colorBlue + '30',
            }
          },
          {
            type: 'line',
            attrs: {
              coordinates: [
                { x: arrowX, y: coordinates[0].y },
                { x: arrowX, y: coordinates[1].y },
                { x: arrowX + 10, y: coordinates[1].y + 10 },
                { x: arrowX, y: coordinates[1].y },
                { x: arrowX, y: coordinates[1].y },
                { x: arrowX - 10, y: coordinates[1].y + 10 },
              ],
            },
            styles: {
              color: colorBlue
            }
          },
          {
            type: 'line',
            attrs: {
              coordinates: [
                { x: coordinates[0].x, y: arrowY },
                { x: coordinates[1].x, y: arrowY },
                { x: coordinates[1].x + (coordinates[0].x > coordinates[1].x ? 10 : -10), y: arrowY - 10 },
                { x: coordinates[1].x, y: arrowY },
                { x: coordinates[1].x, y: arrowY },
                { x: coordinates[1].x + (coordinates[0].x > coordinates[1].x ? 10 : -10), y: arrowY + 10 },
              ],
            },
            styles: {
              color: colorBlue
            }
          },
          {
            type: 'rectText',
            attrs: {
              x: arrowX,
              y: coordinates[1].y - 10,
              text: text ?? '',
              align: 'center',
              baseline: 'bottom',
            }
          },
        ]
      }
      if (points.length === 2) {
        const upperPrice = points[0].value
        const lowerPrice = points[1].value
        text = culuateText(upperPrice, lowerPrice, precision, thousandsSeparator)
      }
      return [
        {
          type: 'polygon',
          attrs: {
            coordinates: [
              coordinates[0],
              { x: coordinates[1].x, y: coordinates[0].y },
              coordinates[1],
              { x: coordinates[0].x, y: coordinates[1].y }
            ]
          },
          styles: {
            color: colorRed + '30',
          }
        },
        {
          type: 'line',
          attrs: {
            coordinates: [
              { x: arrowX, y: coordinates[0].y },
              { x: arrowX, y: coordinates[1].y },
              { x: arrowX + 10, y: coordinates[1].y - 10 },
              { x: arrowX, y: coordinates[1].y },
              { x: arrowX, y: coordinates[1].y },
              { x: arrowX - 10, y: coordinates[1].y - 10 },
            ],
          },
          styles: {
            color: colorRed
          }
        },
        {
          type: 'line',
          attrs: {
            coordinates: [
              { x: coordinates[0].x, y: arrowY },
              { x: coordinates[1].x, y: arrowY },
              { x: coordinates[1].x + (coordinates[0].x > coordinates[1].x ? 10 : -10), y: arrowY - 10 },
              { x: coordinates[1].x, y: arrowY },
              { x: coordinates[1].x, y: arrowY },
              { x: coordinates[1].x + (coordinates[0].x > coordinates[1].x ? 10 : -10), y: arrowY + 10 },
            ],
          },
          styles: {
            color: colorRed
          }
        },
        {
          type: 'rectText',
          attrs: {
            x: arrowX,
            y: coordinates[1].y + 10,
            text: text ?? '',
            align: 'center',
            baseline: 'top',
          },
          styles: {
            backgroundColor: colorRed
          }
        },
      ]
    }
    return []
  }
}

export default measure
