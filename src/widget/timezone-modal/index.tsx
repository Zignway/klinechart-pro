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
import { Modal, Select } from '../../components';

import { Checkbox } from '../../components/ui/checkbox';
import { Label } from '../../components/ui/label';
import type { SelectDataSourceItem } from '../../components';
import { createTimezoneSelectOptions } from './data';
import i18n from '../../i18n';

export interface TimezoneModalProps {
  locale: string;
  timezone: SelectDataSourceItem;
  onClose: () => void;
  onConfirm: (timezone: SelectDataSourceItem) => void;
}

const TimezoneModal: Component<TimezoneModalProps> = (props) => {
  const [innerTimezone, setInnerTimezone] = createSignal(props.timezone);

  const timezoneOptions = createMemo(() =>
    createTimezoneSelectOptions(props.locale)
  );

  return (
    <Modal
      title={i18n('timezone', props.locale)}
      onClose={props.onClose}
    >
      <div class="grid gap-4 py-4">
        {timezoneOptions().map((item) => {
          return (
            <div
              onClick={(_) => {
                setInnerTimezone(item);
                props.onConfirm(item);
              }}
              class="items-top flex space-x-2 mb-4 text-[#6f6e84] hover:text-white"
            >
              <Checkbox
                class="text-white"
                id={`main-${item.key}`}
                checked={innerTimezone().key == item.key}
              />
              <div class="grid gap-1.5 leading-none">
                <Label for={`main-${item.key}`} class="hover:cursor-pointer">
                  {item.text}
                </Label>
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
};

export default TimezoneModal;
