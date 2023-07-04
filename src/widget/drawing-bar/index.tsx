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

import { Component, createMemo, createSignal } from 'solid-js';
import {
  Icon,
  createFibonacciOptions,
  createMagnetOptions,
  createMoreLineOptions,
  createPolygonOptions,
  createSingleLineOptions,
  createWaveOptions,
} from './icons';
import { OverlayCreate, OverlayMode } from 'klinecharts';

import { List } from '../../components';

export interface DrawingBarProps {
  locale: string;
  onDrawingItemClick: (overlay: OverlayCreate) => void;
  onModeChange: (mode: string) => void;
  onLockChange: (lock: boolean) => void;
  onVisibleChange: (visible: boolean) => void;
  onRemoveClick: (groupId: string) => void;
}

const GROUP_ID = 'drawing_tools';

const DrawingBar: Component<DrawingBarProps> = (props) => {
  const [singleLineIcon, setSingleLineIcon] = createSignal(
    'horizontalStraightLine'
  );
  const [moreLineIcon, setMoreLineIcon] = createSignal('priceChannelLine');
  const [polygonIcon, setPolygonIcon] = createSignal('circle');
  const [fibonacciIcon, setFibonacciIcon] = createSignal('fibonacciLine');
  const [waveIcon, setWaveIcon] = createSignal('xabcd');

  const [modeIcon, setModeIcon] = createSignal('weak_magnet');
  const [mode, setMode] = createSignal('normal');

  const [lock, setLock] = createSignal(false);

  const [visible, setVisible] = createSignal(true);

  const [popoverKey, setPopoverKey] = createSignal('');

  const overlays = createMemo(() => {
    return [
      {
        key: 'singleLine',
        icon: singleLineIcon(),
        list: createSingleLineOptions(props.locale),
        setter: setSingleLineIcon,
      },
      {
        key: 'moreLine',
        icon: moreLineIcon(),
        list: createMoreLineOptions(props.locale),
        setter: setMoreLineIcon,
      },
      {
        key: 'polygon',
        icon: polygonIcon(),
        list: createPolygonOptions(props.locale),
        setter: setPolygonIcon,
      },
      {
        key: 'fibonacci',
        icon: fibonacciIcon(),
        list: createFibonacciOptions(props.locale),
        setter: setFibonacciIcon,
      },
      {
        key: 'wave',
        icon: waveIcon(),
        list: createWaveOptions(props.locale),
        setter: setWaveIcon,
      },
    ];
  });

  const modes = createMemo(() => createMagnetOptions(props.locale));

  return (
    <div class="klinecharts-pro-drawing-bar">
      {overlays().map((item) => (
        <div
          class="item"
          tabIndex={0}
          onBlur={() => {
            setPopoverKey('');
          }}
        >
          <span
            style="width:32px;height:32px"
            onClick={() => {
              props.onDrawingItemClick({
                groupId: GROUP_ID,
                name: item.icon,
                visible: visible(),
                lock: lock(),
                mode: mode() as OverlayMode,
              });
            }}
          >
            <Icon name={item.icon} />
          </span>
          <div
            class="icon-arrow"
            onClick={() => {
              if (item.key === popoverKey()) {
                setPopoverKey('');
              } else {
                setPopoverKey(item.key);
              }
            }}
          >
            <svg
              class={item.key === popoverKey() ? 'rotate' : ''}
              viewBox="0 0 4 6"
            >
              <path
                d="M1.07298,0.159458C0.827521,-0.0531526,0.429553,-0.0531526,0.184094,0.159458C-0.0613648,0.372068,-0.0613648,0.716778,0.184094,0.929388L2.61275,3.03303L0.260362,5.07061C0.0149035,5.28322,0.0149035,5.62793,0.260362,5.84054C0.505822,6.05315,0.903789,6.05315,1.14925,5.84054L3.81591,3.53075C4.01812,3.3556,4.05374,3.0908,3.92279,2.88406C3.93219,2.73496,3.87113,2.58315,3.73964,2.46925L1.07298,0.159458Z"
                stroke="none"
                stroke-opacity="0"
              />
            </svg>
          </div>
          {item.key === popoverKey() && (
            <List class="list">
              {item.list.map((data) => (
                <li
                  onClick={() => {
                    item.setter(data.key);
                    props.onDrawingItemClick({
                      name: data.key,
                      lock: lock(),
                      mode: mode() as OverlayMode,
                    });
                    setPopoverKey('');
                  }}
                >
                  <Icon name={data.key} />
                  <span style="padding-left:8px">{data.text}</span>
                </li>
              ))}
            </List>
          )}
        </div>
      ))}
      <span class="split-line" />
      <div
        class="item"
        tabIndex={0}
        onBlur={() => {
          setPopoverKey('');
        }}
      >
        <span
          style="width:32px;height:32px"
          onClick={() => {
            let currentMode = modeIcon();
            if (mode() !== 'normal') {
              currentMode = 'normal';
            }
            console.log(currentMode);
            setMode(currentMode);
            props.onModeChange(currentMode);
          }}
        >
          <Icon name="weak_magnet" />
        </span>
      </div>
      <div
        class="item"
        tabIndex={0}
        onBlur={() => {
          setPopoverKey('');
        }}
      >
        <span
          style="width:32px;height:32px"
          onClick={() => {
            let currentMode = modeIcon();
            if (mode() !== 'normal') {
              currentMode = 'normal';
            }
            setMode(currentMode);
            props.onModeChange(currentMode);
          }}
        >
          {modeIcon() === 'weak_magnet' ? (
            mode() === 'weak_magnet' ? (
              <Icon name="weak_magnet" class="selected" />
            ) : (
              <Icon name="weak_magnet" />
            )
          ) : mode() === 'strong_magnet' ? (
            <Icon name="strong_magnet" class="selected" />
          ) : (
            <Icon name="strong_magnet" />
          )}
        </span>
        <div
          class="icon-arrow"
          onClick={() => {
            if (popoverKey() === 'mode') {
              setPopoverKey('');
            } else {
              setPopoverKey('mode');
            }
          }}
        >
          <svg
            class={popoverKey() === 'mode' ? 'rotate' : ''}
            viewBox="0 0 4 6"
          >
            <path
              d="M1.07298,0.159458C0.827521,-0.0531526,0.429553,-0.0531526,0.184094,0.159458C-0.0613648,0.372068,-0.0613648,0.716778,0.184094,0.929388L2.61275,3.03303L0.260362,5.07061C0.0149035,5.28322,0.0149035,5.62793,0.260362,5.84054C0.505822,6.05315,0.903789,6.05315,1.14925,5.84054L3.81591,3.53075C4.01812,3.3556,4.05374,3.0908,3.92279,2.88406C3.93219,2.73496,3.87113,2.58315,3.73964,2.46925L1.07298,0.159458Z"
              stroke="none"
              stroke-opacity="0"
            />
          </svg>
        </div>
        {popoverKey() === 'mode' && (
          <List class="list">
            {modes().map((data) => (
              <li
                onClick={() => {
                  setModeIcon(data.key);
                  setMode(data.key);
                  props.onModeChange(data.key);
                  setPopoverKey('');
                }}
              >
                <Icon name={data.key} />
                <span style="padding-left:8px">{data.text}</span>
              </li>
            ))}
          </List>
        )}
      </div>
      <div class="item">
        <span
          style="width:32px;height:32px"
          onClick={() => {
            const currentLock = !lock();
            setLock(currentLock);
            props.onLockChange(currentLock);
          }}
        >
          {lock() ? <Icon name="lock" /> : <Icon name="unlock" />}
        </span>
      </div>
      <div class="item">
        <span
          style="width:32px;height:32px"
          onClick={() => {
            const v = !visible();
            setVisible(v);
            props.onVisibleChange(v);
          }}
        >
          {visible() ? <Icon name="visible" /> : <Icon name="invisible" />}
        </span>
      </div>
      <span class="split-line" />
      <div class="item">
        <span
          style="width:32px;height:32px"
          onClick={() => {
            props.onRemoveClick(GROUP_ID);
          }}
        >
          <Icon name="remove" />
        </span>
      </div>
    </div>
  );
};

export default DrawingBar;

// import { checkPointOnSegment } from 'klinecharts/lib/mark/graphicHelper';

// export const MEASURE_GRAPHIC_MARK = {
//   name: 'measure',
//   totalStep: 3,
//   checkMousePointOn: (key, type, points, mousePoint) => {
//     return checkPointOnSegment(points[0], points[1], mousePoint);
//   },
//   createGraphicDataSource: (step, tpPoint, xyPoints) => {
//     if (xyPoints.length === 2) {
//       const startPrice = tpPoint[0].price;
//       const endPrice = tpPoint[1].price;
//       const priceDiff = endPrice - startPrice;
//       const percent = priceDiff / (startPrice / 100);
//       const numberFormatter = new Intl.NumberFormat('en-US', {
//         maximumSignificantDigits: 2,
//       });

//       return [
//         {
//           type: 'arrows',
//           dataSource: [
//             [
//               {
//                 x: xyPoints[0].x + (xyPoints[1].x - xyPoints[0].x) / 2,
//                 y: xyPoints[0].y,
//               },
//               {
//                 x: xyPoints[0].x + (xyPoints[1].x - xyPoints[0].x) / 2,
//                 y: xyPoints[1].y,
//               },
//             ],
//             [
//               {
//                 x: xyPoints[0].x,
//                 y: xyPoints[0].y + (xyPoints[1].y - xyPoints[0].y) / 2,
//               },
//               {
//                 x: xyPoints[1].x,
//                 y: xyPoints[0].y + (xyPoints[1].y - xyPoints[0].y) / 2,
//               },
//             ],
//           ],
//         },
//         {
//           type: 'area',
//           dataSource: [
//             [
//               { ...xyPoints[0] },
//               { x: xyPoints[1].x, y: xyPoints[0].y },
//               { ...xyPoints[1] },
//               { x: xyPoints[0].x, y: xyPoints[1].y },
//             ],
//           ],
//         },
//         {
//           type: 'measure',
//           dataSource: [
//             {
//               x: xyPoints[0].x + (xyPoints[1].x - xyPoints[0].x) / 2,
//               y: xyPoints[1].y,
//               text: `${numberFormatter.format(
//                 priceDiff,
//               )} (${numberFormatter.format(percent)}%)`,
//             },
//           ],
//         },
//       ];
//     }
//     return [];
//   },
//   drawExtend: (ctx, graphicDataSources) => {
//     const arrowsDataSource = graphicDataSources?.[0]?.dataSource;
//     const polygonDataSource = graphicDataSources?.[1]?.dataSource;
//     const measureDataSource = graphicDataSources?.[2]?.dataSource;

//     if (!arrowsDataSource) return;

//     // fill rectangle
//     const rectangleWidth =
//       polygonDataSource[0][1].x - polygonDataSource[0][0].x;
//     const rectangleHeight =
//       polygonDataSource[0][2].y - polygonDataSource[0][0].y;
//     const isShort = rectangleHeight > 0;
//     ctx.fillStyle = isShort ? 'rgba(255,82,82,0.1)' : 'rgba(33,150,243,0.1)';
//     ctx.fillRect(
//       polygonDataSource[0][0].x,
//       polygonDataSource[0][0].y,
//       rectangleWidth,
//       rectangleHeight,
//     );

//     // arrows
//     ctx.beginPath();
//     const minRectangleSize = 10;
//     const strokeStyle = isShort ? 'rgba(255,82,82,1)' : 'rgba(33,150,243,1)';

//     // vertical arrow
//     ctx.strokeStyle = strokeStyle;
//     ctx.moveTo(arrowsDataSource[0][0].x, arrowsDataSource[0][0].y);
//     ctx.lineTo(arrowsDataSource[0][1].x, arrowsDataSource[0][1].y);

//     // draw arrows if rectangle is not small
//     if (Math.abs(rectangleHeight) > minRectangleSize) {
//       ctx.lineTo(
//         arrowsDataSource[0][1].x + (isShort ? -5 : 5),
//         arrowsDataSource[0][1].y + (isShort ? -5 : 5),
//       );
//       ctx.moveTo(arrowsDataSource[0][1].x, arrowsDataSource[0][1].y);
//       ctx.lineTo(
//         arrowsDataSource[0][1].x + (isShort ? 5 : -5),
//         arrowsDataSource[0][1].y + (isShort ? -5 : 5),
//       );
//     }
//     ctx.stroke();

//     // horizontal
//     ctx.strokeStyle = strokeStyle;
//     ctx.moveTo(arrowsDataSource[1][0].x, arrowsDataSource[1][0].y);
//     ctx.lineTo(arrowsDataSource[1][1].x, arrowsDataSource[1][1].y);

//     // draw arrows if rectangle is not small
//     if (Math.abs(rectangleWidth) > minRectangleSize) {
//       const isLeft = rectangleWidth < 0;
//       ctx.lineTo(
//         arrowsDataSource[1][1].x + (isLeft ? 5 : -5),
//         arrowsDataSource[1][1].y + 5,
//       );
//       ctx.moveTo(arrowsDataSource[1][1].x, arrowsDataSource[1][1].y);
//       ctx.lineTo(
//         arrowsDataSource[1][1].x + (isLeft ? 5 : -5),
//         arrowsDataSource[1][1].y - 5,
//       );
//     }
//     ctx.stroke();

//     // measure box
//     ctx.fillStyle = isShort ? 'rgba(255,82,82,1)' : 'rgba(33,150,243,1)';
//     const textSize = ctx.measureText(measureDataSource[0].text);
//     const measureBoxX = measureDataSource[0].x - textSize.width / 2 - 10;
//     const measureBoxY = measureDataSource[0].y + (isShort ? 10 : -40);
//     const measureBoxWidth = textSize.width + 20;
//     const measureBoxHeight = 30;
//     ctx.fillRect(measureBoxX, measureBoxY, measureBoxWidth, measureBoxHeight);
//     ctx.textAlign = 'center';
//     ctx.fillStyle = '#fff';
//     ctx.textBaseline = 'middle';
//     ctx.font = ctx.font.replace(/\d+px/, '12px');
//     ctx.fillText(
//       measureDataSource[0].text,
//       measureDataSource[0].x,
//       measureBoxY + measureBoxHeight / 2,
//     );
//   },
// };
