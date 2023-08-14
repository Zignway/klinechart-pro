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

import {
  ActionType,
  Chart,
  DomPosition,
  FormatDateType,
  Indicator,
  Nullable,
  OverlayMode,
  PaneOptions,
  Styles,
  TooltipIconPosition,
  dispose,
  init,
  utils
} from '@numlemon/klinecharts';
import { ChartPro, ChartProOptions, Period, SymbolInfo } from './types';
import {
  Component,
  Show,
  createEffect,
  createSignal,
  onCleanup,
  onMount,
  startTransition
} from 'solid-js';
import {
  DrawingBar,
  IndicatorModal,
  IndicatorSettingModal,
  PeriodBar,
  ScreenshotModal,
  SettingModal,
  TimezoneModal
} from './widget';
import { Loading, LoadingMore, SelectDataSourceItem } from './components';

import lodashClone from 'lodash/cloneDeep';
import lodashSet from 'lodash/set';
import { translateTimezone } from './widget/timezone-modal/data';

export interface ChartProComponentProps
  extends Required<Omit<ChartProOptions, 'container'>> {
  ref: (chart: ChartPro) => void;
}

interface PrevSymbolPeriod {
  symbol: SymbolInfo;
  period: Period;
}

function createIndicator(
  widget: Nullable<Chart>,
  indicatorName: string,
  isStack?: boolean,
  paneOptions?: PaneOptions
): Nullable<string> {
  if (indicatorName === 'VOL') {
    paneOptions = { gap: { bottom: 2 }, ...paneOptions };
  }
  return (
    widget?.createIndicator(
      {
        name: indicatorName,
        // @ts-expect-error
        createTooltipDataSource: ({ indicator, defaultStyles }) => {
          const icons = [];
          if (indicator.visible) {
            icons.push(defaultStyles.tooltip.icons[1]);
            icons.push(defaultStyles.tooltip.icons[2]);
            icons.push(defaultStyles.tooltip.icons[3]);
          } else {
            icons.push(defaultStyles.tooltip.icons[0]);
            icons.push(defaultStyles.tooltip.icons[2]);
            icons.push(defaultStyles.tooltip.icons[3]);
          }
          return { icons };
        }
      },
      isStack,
      paneOptions
    ) ?? null
  );
}

const ChartProComponent: Component<ChartProComponentProps> = (props) => {
  let widgetRef: HTMLDivElement | undefined = undefined;
  let widget: Nullable<Chart> = null;

  let priceUnitDom: HTMLElement;

  let loading = false;

  const [theme, setTheme] = createSignal(props.theme);
  const [styles, setStyles] = createSignal(props.styles);
  const [locale, setLocale] = createSignal(props.locale);
  const [isAutoEnabled, setIsAutoEnabled] = createSignal(true);

  const [symbol, setSymbol] = createSignal(props.symbol);
  const [period, setPeriod] = createSignal(props.period);
  const [indicatorModalVisible, setIndicatorModalVisible] = createSignal(false);
  const [mainIndicators, setMainIndicators] = createSignal([
    ...props.mainIndicators!
  ]);
  const [subIndicators, setSubIndicators] = createSignal({});

  const [timezoneModalVisible, setTimezoneModalVisible] = createSignal(false);
  const [timezone, setTimezone] = createSignal<SelectDataSourceItem>({
    key: props.timezone,
    text: translateTimezone(props.timezone, props.locale)
  });

  const [settingModalVisible, setSettingModalVisible] = createSignal(false);
  const [widgetDefaultStyles, setWidgetDefaultStyles] = createSignal<Styles>();

  const [screenshotUrl, setScreenshotUrl] = createSignal('');

  const [drawingBarVisible, setDrawingBarVisible] = createSignal(
    props.isMobile ? false : props.drawingBarVisible
  );

  const [loadingVisible, setLoadingVisible] = createSignal(false);
  const [loadingMoreVisible, setLoadingMoreVisible] = createSignal(false);
  const [isCurrentOverlayMeasure, setIsCurrentOverlayMeasure] = createSignal('');
  const [isOverlaySelected, setIsOverlaySelected] = createSignal('');
  const [isCurrentOverlay, setIsCurrentOverlay] = createSignal('');

  const [indicatorSettingModalParams, setIndicatorSettingModalParams] =
    createSignal({
      visible: false,
      indicatorName: '',
      paneId: '',
      calcParams: [] as Array<any>
    });

  const createHorizontalLine = (
    groupId: string,
    color: string,
    price: number
  ) => {
    widget!.createOverlay({
      groupId,
      name: 'simpleTag',
      lock: true,
      styles: {
        line: {
          color: color + '9c',
          size: 0.5
        },
        rectText: {
          borderColor: color,
          backgroundColor: color
        }
      },
      points: [
        {
          value: price
        }
      ]
    });
  };

  const createPosition = (
    groupId: string,
    color: string,
    price: number,
    text: string
  ) => {
    widget!.createOverlay({
      groupId,
      name: 'positionPrice',
      lock: true,
      styles: {
        line: {
          color,
          size: 1
        },
        rectText: {
          borderColor: color,
          backgroundColor: color
        }
      },
      extendData: {
        text,
        price,
        color
      },
      points: [
        {
          value: price
        }
      ]
    });
  };

  const removeByGroupId = (groupId: string) => {
    widget!.removeOverlay({ groupId });
  };

  const getDataList = () => {
    return widget!.getDataList();
  }

  props.ref({
    setTheme,
    getTheme: () => theme(),
    setStyles,
    getStyles: () => widget!.getStyles(),
    setLocale,
    getLocale: () => locale(),
    setTimezone: (timezone: string) => {
      setTimezone({
        key: timezone,
        text: translateTimezone(props.timezone, locale())
      });
    },
    getTimezone: () => timezone().key,
    setSymbol: (symbol: SymbolInfo) => {
      loading = false;
      setLoadingVisible(true)
      setSymbol(symbol);
    },
    getSymbol: () => symbol(),
    setPeriod,
    getPeriod: () => period(),
    createHorizontalLine,
    createPosition,
    removeByGroupId,
    getDataList,
  });

  const documentResize = () => {
    widget?.resize();
  };

  const adjustFromTo = (period: Period, toTimestamp: number, count: number) => {
    let to = toTimestamp;
    let from = to;
    switch (period.timespan) {
      case 'minute': {
        to = to - (to % (60 * 1000));
        from = to - count * period.multiplier * 60 * 1000;
        break;
      }
      case 'hour': {
        to = to - (to % (60 * 60 * 1000));
        from = to - count * period.multiplier * 60 * 60 * 1000;
        break;
      }
      case 'day': {
        to = to - (to % (60 * 60 * 1000));
        from = to - count * period.multiplier * 24 * 60 * 60 * 1000;
        break;
      }
      case 'week': {
        const date = new Date(to);
        const week = date.getDay();
        const dif = week === 0 ? 6 : week - 1;
        to = to - dif * 60 * 60 * 24;
        const newDate = new Date(to);
        to = new Date(
          `${newDate.getFullYear()}-${newDate.getMonth() + 1
          }-${newDate.getDate()}`
        ).getTime();
        from = count * period.multiplier * 7 * 24 * 60 * 60 * 1000;
        break;
      }
      case 'month': {
        const date = new Date(to);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        to = new Date(`${year}-${month}-01`).getTime();
        from = count * period.multiplier * 30 * 24 * 60 * 60 * 1000;
        const fromDate = new Date(from);
        from = new Date(
          `${fromDate.getFullYear()}-${fromDate.getMonth() + 1}-01`
        ).getTime();
        break;
      }
      case 'year': {
        const date = new Date(to);
        const year = date.getFullYear();
        to = new Date(`${year}-01-01`).getTime();
        from = count * period.multiplier * 365 * 24 * 60 * 60 * 1000;
        const fromDate = new Date(from);
        from = new Date(`${fromDate.getFullYear()}-01-01`).getTime();
        break;
      }
    }
    return [from, to];
  };

  onMount(() => {
    window.addEventListener('resize', documentResize);
    widget = init(widgetRef!, {
      customApi: {
        formatDate: (
          dateTimeFormat: Intl.DateTimeFormat,
          timestamp,
          format: string,
          type: FormatDateType
        ) => {
          const p = period();
          switch (p.timespan) {
            case 'minute': {
              if (type === FormatDateType.XAxis) {
                return utils.formatDate(dateTimeFormat, timestamp, 'HH:mm');
              }
              return utils.formatDate(
                dateTimeFormat,
                timestamp,
                'YYYY-MM-DD HH:mm'
              );
            }
            case 'hour': {
              if (type === FormatDateType.XAxis) {
                return utils.formatDate(
                  dateTimeFormat,
                  timestamp,
                  'MM-DD HH:mm'
                );
              }
              return utils.formatDate(
                dateTimeFormat,
                timestamp,
                'YYYY-MM-DD HH:mm'
              );
            }
            case 'day':
            case 'week':
              return utils.formatDate(dateTimeFormat, timestamp, 'YYYY-MM-DD');
            case 'month': {
              if (type === FormatDateType.XAxis) {
                return utils.formatDate(dateTimeFormat, timestamp, 'YYYY-MM');
              }
              return utils.formatDate(dateTimeFormat, timestamp, 'YYYY-MM-DD');
            }
            case 'year': {
              if (type === FormatDateType.XAxis) {
                return utils.formatDate(dateTimeFormat, timestamp, 'YYYY');
              }
              return utils.formatDate(dateTimeFormat, timestamp, 'YYYY-MM-DD');
            }
          }
          return utils.formatDate(
            dateTimeFormat,
            timestamp,
            'YYYY-MM-DD HH:mm'
          );
        }
      }
    });

    if (widget) {
      const watermarkContainer = widget.getDom('candle_pane', DomPosition.Main);
      if (watermarkContainer) {
        let watermark = document.createElement('div');
        watermark.className = 'klinecharts-pro-watermark';
        if (utils.isString(props.watermark)) {
          const str = (props.watermark as string).replace(/(^\s*)|(\s*$)/g, '');
          watermark.innerHTML = str;
        } else {
          watermark.appendChild(props.watermark as Node);
        }
        watermarkContainer.appendChild(watermark);
      }

      const priceUnitContainer = widget.getDom(
        'candle_pane',
        DomPosition.YAxis
      );
      priceUnitDom = document.createElement('span');
      priceUnitDom.className = 'klinecharts-pro-price-unit';
      priceUnitContainer?.appendChild(priceUnitDom);
    }

    mainIndicators().forEach((indicator) => {
      createIndicator(widget, indicator, true, { id: 'candle_pane' });
    });
    const subIndicatorMap = {};
    props.subIndicators!.forEach((indicator) => {
      const paneId = createIndicator(widget, indicator, true);
      if (paneId) {
        // @ts-expect-error
        subIndicatorMap[indicator] = paneId;
      }
    });
    setSubIndicators(subIndicatorMap);
    widget?.loadMore((timestamp) => {
      loading = true;
      setLoadingMoreVisible(true);
      const get = async () => {
        const p = period();
        const [to] = adjustFromTo(p, timestamp!, 1);
        const [from] = adjustFromTo(p, to, 300);
        const kLineDataList = await props.datafeed.getHistoryKLineData(
          symbol(),
          p,
          from,
          to
        );
        widget?.applyMoreData(kLineDataList, kLineDataList.length > 0);
        loading = false;
        setLoadingMoreVisible(false);
      };
      get().catch((e) => {
        console.error(e);
        setLoadingMoreVisible(false);
        loading = false;
      });
    });
    widget?.subscribeAction(ActionType.OnTooltipIconClick, (data) => {
      if (data.indicatorName) {
        switch (data.iconId) {
          case 'visible': {
            widget?.overrideIndicator(
              { name: data.indicatorName, visible: true },
              data.paneId
            );
            break;
          }
          case 'invisible': {
            widget?.overrideIndicator(
              { name: data.indicatorName, visible: false },
              data.paneId
            );
            break;
          }
          case 'setting': {
            const indicator = widget?.getIndicatorByPaneId(
              data.paneId,
              data.indicatorName
            ) as Indicator;
            setIndicatorSettingModalParams({
              visible: true,
              indicatorName: data.indicatorName,
              paneId: data.paneId,
              calcParams: indicator.calcParams
            });
            break;
          }
          case 'close': {
            if (data.paneId === 'candle_pane') {
              const newMainIndicators = [...mainIndicators()];
              widget?.removeIndicator('candle_pane', data.indicatorName);
              newMainIndicators.splice(
                newMainIndicators.indexOf(data.indicatorName),
                1
              );
              setMainIndicators(newMainIndicators);
            } else {
              const newIndicators = { ...subIndicators() };
              widget?.removeIndicator(data.paneId, data.indicatorName);
              // @ts-expect-error
              delete newIndicators[data.indicatorName];
              setSubIndicators(newIndicators);
            }
          }
        }
      }
    });
    widget?.subscribeAction(ActionType.OnCrosshairChange, (data) => {
      if (isCurrentOverlayMeasure() !== '') {
        const measureInfo = widget?.getOverlayById(`${isCurrentOverlayMeasure()}`);
        if (measureInfo?.currentStep === -1) {
          setIsOverlaySelected('')
        }
      } else {
        const info = widget?.getOverlayById(`${isCurrentOverlay()}`);
        if (info?.currentStep === -1) {
          setIsCurrentOverlay('')
          setIsOverlaySelected('')
        }
      }
    });
  });

  onCleanup(() => {
    window.removeEventListener('resize', documentResize);
    dispose(widgetRef!);
  });

  createEffect(() => {
    const s = symbol();
    if (s?.priceCurrency) {
      priceUnitDom.innerHTML = s?.priceCurrency.toLocaleUpperCase();
      priceUnitDom.style.display = 'flex';
    } else {
      priceUnitDom.style.display = 'none';
    }
    widget?.setPriceVolumePrecision(
      s?.pricePrecision ?? 2,
      s?.volumePrecision ?? 0
    );
  });

  createEffect((prev?: PrevSymbolPeriod) => {
    if (!loading) {
      if (prev) {
        props.datafeed.unsubscribe(prev.symbol, prev.period);
      }
      const s = symbol();
      const p = period();
      loading = true;
      setLoadingVisible(true);
      const get = async () => {
        // const [from, to] = adjustFromTo(p, new Date().getTime(), 300);
        // FIX START TIME
        const [from, to] = adjustFromTo(p, 1688169600000, 300);
        const kLineDataList = await props.datafeed.getHistoryKLineData(s, p, from, to);
        widget?.applyNewData(kLineDataList, kLineDataList.length > 0, () => {
          // if (!props.isMobile) {
          //   widget!.setAutoEnabled(false)
          //   setIsAutoEnabled(false)
          // }
          widget?.resize();
        });
        props.datafeed.subscribe(s, p, (data) => {
          widget?.updateData(data);
        });
        loading = false;
        setLoadingVisible(false);
      }
      get().catch((err) => {
        console.error('get error ', err);
        loading = false;
        setLoadingVisible(false);
      });
      return { symbol: s, period: p };
    }
    return prev;
  });

  createEffect(() => {
    const t = theme();
    widget?.setStyles(t);
    const color = t === 'dark' ? '#929AA5' : '#76808F';
    widget?.setStyles({
      candle: {
        priceMark: {
          high: {
            textFamily: 'Roboto Mono',
          },
          low: {
            textFamily: 'Roboto Mono',
          },
          last: {
            text: {
              family: 'Roboto Mono',
            },
          },
        },
      },
      indicator: {
        lastValueMark: {
          text: {
            family: 'Roboto Mono',
          }
        },
        tooltip: {
          text: {
            family: 'Roboto Mono',
          },
          icons: [
            {
              id: 'visible',
              position: TooltipIconPosition.Middle,
              marginLeft: 8,
              marginTop: 7,
              marginRight: 0,
              marginBottom: 0,
              paddingLeft: 0,
              paddingTop: 0,
              paddingRight: 0,
              paddingBottom: 0,
              icon: '\ue903',
              fontFamily: 'icomoon',
              size: 14,
              color: color,
              activeColor: color,
              backgroundColor: 'transparent',
              activeBackgroundColor: 'rgba(22, 119, 255, 0.15)'
            },
            {
              id: 'invisible',
              position: TooltipIconPosition.Middle,
              marginLeft: 8,
              marginTop: 7,
              marginRight: 0,
              marginBottom: 0,
              paddingLeft: 0,
              paddingTop: 0,
              paddingRight: 0,
              paddingBottom: 0,
              icon: '\ue901',
              fontFamily: 'icomoon',
              size: 14,
              color: color,
              activeColor: color,
              backgroundColor: 'transparent',
              activeBackgroundColor: 'rgba(22, 119, 255, 0.15)'
            },
            {
              id: 'setting',
              position: TooltipIconPosition.Middle,
              marginLeft: 6,
              marginTop: 7,
              marginBottom: 0,
              marginRight: 0,
              paddingLeft: 0,
              paddingTop: 0,
              paddingRight: 0,
              paddingBottom: 0,
              icon: '\ue902',
              fontFamily: 'icomoon',
              size: 14,
              color: color,
              activeColor: color,
              backgroundColor: 'transparent',
              activeBackgroundColor: 'rgba(22, 119, 255, 0.15)'
            },
            {
              id: 'close',
              position: TooltipIconPosition.Middle,
              marginLeft: 6,
              marginTop: 7,
              marginRight: 0,
              marginBottom: 0,
              paddingLeft: 0,
              paddingTop: 0,
              paddingRight: 0,
              paddingBottom: 0,
              icon: '\ue900',
              fontFamily: 'icomoon',
              size: 14,
              color: color,
              activeColor: color,
              backgroundColor: 'transparent',
              activeBackgroundColor: 'rgba(22, 119, 255, 0.15)'
            }
          ]
        }
      },
      xAxis: {
        tickText: {
          family: 'Roboto Mono',
        }
      },
      yAxis: {
        tickText: {
          family: 'Roboto Mono',
        }
      },
      crosshair: {
        horizontal: {
          text: {
            family: 'Roboto Mono',
          }
        },
        vertical: {
          text: {
            family: 'Roboto Mono',
          }
        }
      },
      overlay: {
        text: {
          family: 'Roboto Mono',
        },
        rectText: {
          family: 'Roboto Mono',
        }
      }
    });
  });

  createEffect(() => {
    widget?.setLocale(locale());
  });

  createEffect(() => {
    widget?.setTimezone(timezone().key);
  });

  createEffect(() => {
    if (styles()) {
      widget?.setStyles(styles());
      setWidgetDefaultStyles(lodashClone(widget!.getStyles()));
    }
  });

  // createEffect(() => {
  //   console.log('isAutoEnabled', isAutoEnabled())
  //   if (widget) {
  //     setIsAutoEnabled(widget.isAutoEnabled());
  //   }
  // })

  return (
    <>
      <i class="icon-close klinecharts-pro-load-icon" />
      <Show when={indicatorModalVisible()}>
        <IndicatorModal
          onClose={() => { setIndicatorModalVisible(false) }}
          locale={props.locale}
          mainIndicators={mainIndicators()}
          subIndicators={subIndicators()}
          // isOpen={indicatorModalVisible()}
          // setIsOpen={setIndicatorModalVisible}
          onMainIndicatorChange={(data) => {
            const newMainIndicators = [...mainIndicators()];
            if (data.added) {
              createIndicator(widget, data.name, true, { id: 'candle_pane' });
              newMainIndicators.push(data.name);
            } else {
              widget?.removeIndicator('candle_pane', data.name);
              newMainIndicators.splice(newMainIndicators.indexOf(data.name), 1);
            }
            setMainIndicators(newMainIndicators);
          }}
          onSubIndicatorChange={(data) => {
            const newSubIndicators = { ...subIndicators() };
            if (data.added) {
              const paneId = createIndicator(widget, data.name);
              if (paneId) {
                // @ts-expect-error
                newSubIndicators[data.name] = paneId;
              }
            } else {
              if (data.paneId) {
                widget?.removeIndicator(data.paneId, data.name);
                // @ts-expect-error
                delete newSubIndicators[data.name];
              }
            }
            setSubIndicators(newSubIndicators);
          }}
        />
      </Show>
      <Show when={timezoneModalVisible()}>
        <TimezoneModal
          locale={props.locale}
          timezone={timezone()}
          onClose={() => { setTimezoneModalVisible(false) }}
          // isOpen={timezoneModalVisible()}
          // setIsOpen={() => {
          //   setTimezoneModalVisible(false);
          // }}
          onConfirm={setTimezone}
        />
      </Show>
      <Show when={settingModalVisible()}>
        <SettingModal
          locale={props.locale}
          currentStyles={utils.clone(widget!.getStyles())}
          // isOpen={settingModalVisible()}
          // setIsOpen={setSettingModalVisible}
          onClose={() => { setSettingModalVisible(false) }}
          onChange={(style) => {
            widget?.setStyles(style);
          }}
          onRestoreDefault={(options: SelectDataSourceItem[]) => {
            const style = {};
            options.forEach((option) => {
              const key = option.key;
              lodashSet(
                style,
                key,
                utils.formatValue(widgetDefaultStyles(), key)
              );
            });
            widget?.setStyles(style);
          }}
        />
      </Show>
      {
        !props.isMobile && (
          <Show when={screenshotUrl().length > 0}>
            <ScreenshotModal
              locale={props.locale}
              url={screenshotUrl()}
              onClose={() => {
                setScreenshotUrl('');
              }}
            />
          </Show>
        )
      }
      {
        !props.isMobile && (
          <Show when={indicatorSettingModalParams().visible}>
            <IndicatorSettingModal
              locale={props.locale}
              params={indicatorSettingModalParams()}
              onClose={() => {
                setIndicatorSettingModalParams({
                  visible: false,
                  indicatorName: '',
                  paneId: '',
                  calcParams: []
                });
              }}
              onConfirm={(params) => {
                const modalParams = indicatorSettingModalParams();
                widget?.overrideIndicator(
                  { name: modalParams.indicatorName, calcParams: params },
                  modalParams.paneId
                );
              }}
            />
          </Show>
        )
      }
      <PeriodBar
        isMobile={props.isMobile}
        locale={props.locale}
        symbol={symbol()}
        spread={drawingBarVisible()}
        period={period()}
        periods={props.periods}
        onMenuClick={async () => {
          try {
            await startTransition(() =>
              setDrawingBarVisible(!drawingBarVisible())
            );
            widget?.resize();
          } catch (e) { }
        }}
        onPeriodChange={(period) => {
          if (loading == false && loadingMoreVisible() == false && loadingVisible() == false) {
            setPeriod(period)
          }
        }}
        onIndicatorClick={() => {
          setIndicatorModalVisible((visible) => !visible);
        }}
        onTimezoneClick={() => {
          setTimezoneModalVisible((visible) => !visible);
        }}
        onSettingClick={() => {
          setSettingModalVisible((visible) => !visible);
        }}
        onScreenshotClick={() => {
          if (widget) {
            const url = widget.getConvertPictureUrl(
              true,
              'jpeg',
              props.theme === 'dark' ? '#151517' : '#ffffff'
            );
            setScreenshotUrl(url);
          }
        }}
        currentStyles={styles()}
        onChangeStyle={(style) => {
          widget?.setStyles(style);
        }}
        onChangeAutoEnabled={() => {
          if (widget) {
            setIsAutoEnabled(!widget.isAutoEnabled());
            widget.setAutoEnabled(!widget.isAutoEnabled());
          }
        }}
        isAutoEnabled={isAutoEnabled()}
      />
      <div class="klinecharts-pro-content">
        <Show when={loadingMoreVisible()}>
          <LoadingMore />
        </Show>
        <Show when={loadingVisible()}>
          <Loading />
        </Show>
        <Show when={drawingBarVisible()}>
          <DrawingBar
            locale={props.locale}
            isOverlaySelected={isOverlaySelected()}
            onDrawingItemClick={(overlay) => {
              if (widget) {
                switch (overlay.name) {
                  case "measure":
                    if (isCurrentOverlayMeasure() !== '' && isOverlaySelected() === 'measure') {
                      widget.removeOverlay({ id: `${isCurrentOverlayMeasure()}` });
                      setIsCurrentOverlayMeasure('')
                      setIsOverlaySelected('')
                    } else if (isCurrentOverlayMeasure() !== '' && isOverlaySelected() !== 'measure') {
                      widget.removeOverlay({ id: `${isCurrentOverlayMeasure()}` });
                      const res = widget.createOverlay(overlay);
                      setIsCurrentOverlayMeasure(`${res}`);
                      setIsOverlaySelected('measure')
                    } else {
                      const res = widget.createOverlay(overlay);
                      setIsCurrentOverlayMeasure(`${res}`);
                      setIsOverlaySelected('measure')
                    }
                    break;

                  default:
                    setIsOverlaySelected(overlay.name);
                    const res = widget.createOverlay(overlay);
                    setIsCurrentOverlay(`${res}`)
                    break;
                }
              }
            }}
            onModeChange={(mode) => {
              widget?.overrideOverlay({ mode: mode as OverlayMode });
            }}
            onLockChange={(lock) => {
              widget?.overrideOverlay({ lock });
            }}
            onVisibleChange={(visible) => {
              widget?.overrideOverlay({ visible });
            }}
            onRemoveClick={(groupId) => {
              widget?.removeOverlay({ groupId });
            }}
          />
        </Show>
        <div
          ref={widgetRef}
          class="klinecharts-pro-widget"
          data-drawing-bar-visible={drawingBarVisible()}
          onclick={(e) => {
            if (isCurrentOverlayMeasure() !== '' && widget && isOverlaySelected() !== 'measure') {
              widget.removeOverlay({ id: `${isCurrentOverlayMeasure()}` });
            }
          }}
        />
      </div>
    </>
  );
};

export default ChartProComponent;
