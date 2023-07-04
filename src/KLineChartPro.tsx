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

import { ChartPro, ChartProOptions, Period, SymbolInfo } from './types'
import { DeepPartial, Nullable, Styles, utils } from 'klinecharts'

import ChartProComponent from './ChartProComponent'
import { render } from 'solid-js/web'

export default class KLineChartPro implements ChartPro {
  constructor(options: ChartProOptions) {
    if (utils.isString(options.container)) {
      this._container = document.getElementById(options.container as string)
      if (!this._container) {
        throw new Error('Container is null')
      }
    } else {
      this._container = options.container as HTMLElement
    }
    this._container.classList.add('klinecharts-pro')
    this._container.setAttribute('data-theme', options.theme ?? 'dark')

    render(
      () => (
        <ChartProComponent
          ref={(chart: ChartPro) => { this._chartApi = chart }}
          styles={options.styles ?? {}}
          watermark={options.watermark ?? ''}
          theme={options.theme ?? 'dark'}
          locale={options.locale ?? 'en-US'}
          drawingBarVisible={options.drawingBarVisible ?? true}
          symbol={options.symbol}
          period={options.period}
          periods={
            options.periods ?? [
              { multiplier: 1, timespan: 'minute', text: '1m' },
              { multiplier: 5, timespan: 'minute', text: '5m' },
              { multiplier: 15, timespan: 'minute', text: '15m' },
              { multiplier: 1, timespan: 'hour', text: '1H' },
              { multiplier: 2, timespan: 'hour', text: '2H' },
              { multiplier: 4, timespan: 'hour', text: '4H' },
              { multiplier: 1, timespan: 'day', text: 'D' },
              { multiplier: 1, timespan: 'week', text: 'W' },
              { multiplier: 1, timespan: 'month', text: 'M' },
              { multiplier: 1, timespan: 'year', text: 'Y' }
            ]
          }
          timezone={options.timezone ?? 'Asia/Bangkok'}
          mainIndicators={options.mainIndicators ?? ['MA']}
          subIndicators={options.subIndicators ?? ['VOL']}
          // datafeed={options.datafeed}
          getHistoryKLineData={options.getHistoryKLineData}
          subscribe={options.subscribe}
          unsubscribe={options.unsubscribe}
        />
      ),
      this._container
    )
  }

  private _container: Nullable<HTMLElement>

  private _chartApi: Nullable<ChartPro> = null


  setTheme(theme: string): void {
    this._container?.setAttribute('data-theme', theme)
    this._chartApi!.setTheme(theme)
  }

  getTheme(): string {
    return this._chartApi!.getTheme()
  }

  setStyles(styles: DeepPartial<Styles>): void {
    this._chartApi!.setStyles(styles)
  }

  getStyles(): Styles {
    return this._chartApi!.getStyles()
  }

  setLocale(locale: string): void {
    this._chartApi!.setLocale(locale)
  }

  getLocale(): string {
    return this._chartApi!.getLocale()
  }

  setTimezone(timezone: string): void {
    this._chartApi!.setTimezone(timezone)
  }

  getTimezone(): string {
    return this._chartApi!.getTimezone()
  }

  setSymbol(symbol: SymbolInfo): void {
    this._chartApi!.setSymbol(symbol)
  }

  getSymbol(): SymbolInfo {
    return this._chartApi!.getSymbol()
  }

  setPeriod(period: Period): void {
    this._chartApi!.setPeriod(period)
  }

  getPeriod(): Period {
    return this._chartApi!.getPeriod()
  }

  createHorizontalLine(groupId: string, color: string, price: number): void {
    this._chartApi!.createHorizontalLine(groupId, color, price)
  }

  removeByGroupId(groupId: string): void {
    this._chartApi!.removeByGroupId(groupId)
  }
}
