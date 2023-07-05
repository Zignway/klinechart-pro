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

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../components/ui/accordion';

import { Checkbox } from '../../components/ui/checkbox';
import { Component } from 'solid-js';
import { Label } from '../../components/ui/label';
import { Modal } from '../../components';
import i18n from '../../i18n';

type OnIndicatorChange = (params: {
  name: string;
  paneId: string;
  added: boolean;
}) => void;

export interface IndicatorModalProps {
  locale: string;
  mainIndicators: string[];
  subIndicators: object;
  onMainIndicatorChange: OnIndicatorChange;
  onSubIndicatorChange: OnIndicatorChange;
  onClose: () => void;
}

const IndicatorModal: Component<IndicatorModalProps> = (props) => {
  return (
    <Modal
      title={i18n('indicator', props.locale)}
      onClose={props.onClose}
    >
      <div class="grid gap-4 py-4">
        <Accordion
          multiple={true}
          defaultValue={['main_indicator', 'sub_indicator']}
          class="w-full"
        >
          <AccordionItem value="main_indicator">
            <AccordionTrigger>
              {i18n('main_indicator', props.locale)}
            </AccordionTrigger>
            <AccordionContent>
              {['MA', 'EMA', 'SMA', 'BOLL', 'SAR', 'BBI'].map((name) => {
                const checked = props.mainIndicators.includes(name);
                return (
                  <div
                    onClick={(_) => {
                      props.onMainIndicatorChange({
                        name,
                        paneId: 'candle_pane',
                        added: !checked
                      });
                    }}
                    class="items-top flex space-x-2 mb-4 hover:text-white"
                  >
                    <Checkbox id={`main-${name}`} checked={checked} />
                    <div class="grid gap-1.5 leading-none">
                      <Label
                        for={`main-${name}`}
                        class="hover:cursor-pointer"
                      >
                        {i18n(name.toLowerCase(), props.locale)}
                      </Label>
                    </div>
                  </div>
                );
              })}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="sub_indicator">
            <AccordionTrigger>
              {i18n('sub_indicator', props.locale)}
            </AccordionTrigger>
            <AccordionContent>
              {[
                'MA',
                'EMA',
                'VOL',
                'MACD',
                'BOLL',
                'KDJ',
                'RSI',
                'BIAS',
                'BRAR',
                'CCI',
                'DMI',
                'CR',
                'PSY',
                'DMA',
                'TRIX',
                'OBV',
                'VR',
                'WR',
                'MTM',
                'EMV',
                'SAR',
                'SMA',
                'ROC',
                'PVT',
                'BBI',
                'AO'
              ].map((name) => {
                const checked = name in props.subIndicators;
                return (
                  <div
                    onClick={(_) => {
                      props.onSubIndicatorChange({
                        name,
                        // @ts-expect-error
                        paneId: props.subIndicators[name] ?? '',
                        added: !checked
                      });
                    }}
                    class="items-top flex space-x-2 mb-4 hover:text-white"
                  >
                    <Checkbox id={`main-${name}`} checked={checked} />
                    <div class="grid gap-1.5 leading-none">
                      <Label
                        for={`main-${name}`}
                        class="hover:cursor-pointer"
                      >
                        {i18n(name.toLowerCase(), props.locale)}
                      </Label>
                    </div>
                  </div>
                );
              })}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

    </Modal>
  );
};

export default IndicatorModal;
