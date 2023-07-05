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

import { Component, For, createEffect, createSignal } from 'solid-js'
import { DeepPartial, Styles, utils } from 'klinecharts'
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group'

import { Label } from '../../components/ui/label'
import { Modal } from '../../components'
import type { SelectDataSourceItem } from '../../components'
import { Switch } from '../../components/ui/switch'
import { getOptions } from './data'
import i18n from '../../i18n'
import lodashSet from 'lodash/set'

export interface SettingModalProps {
  locale: string
  currentStyles: Styles
  onClose: () => void
  onChange: (style: DeepPartial<Styles>) => void
  onRestoreDefault: (options: SelectDataSourceItem[]) => void
}

const SettingModal: Component<SettingModalProps> = props => {
  const [styles, setStyles] = createSignal(props.currentStyles)
  const [options, setOptions] = createSignal(getOptions(props.locale))

  createEffect(() => {
    setOptions(getOptions(props.locale))
  })

  const update = (option: SelectDataSourceItem, newValue: any) => {
    const style = {}
    lodashSet(style, option.key, newValue)
    const ss = utils.clone(styles())
    lodashSet(ss, option.key, newValue)
    setStyles(ss)
    setOptions(options().map(op => ({ ...op })))
    props.onChange(style)
  }

  return (
    <Modal
      title={i18n('setting', props.locale)}
      width={560}
      // buttons={[
      //   {
      //     children: i18n('restore_default', props.locale),
      //     onClick: () => {
      //       props.onRestoreDefault(options())
      //       props.onClose()
      //     }
      //   }
      // ]}
      onClose={props.onClose}>
      <div class="grid gap-4 py-4">
        {options().map((item) => {
          const value = utils.formatValue(styles(), item.key);
          if (item.component == 'switch') {
            const open = !!value;
            return (
              <Switch
                label={item.text}
                onChange={() => {
                  const newValue = !open;
                  update(item, newValue);
                }}
                checked={open}
              />
            );
          } else if (item.component == 'select') {
            return (
              <>
                <Label class="text-white text-[14px]">{item.text}</Label>
                <RadioGroup
                  defaultValue={value as string}
                  // value={}
                  onChange={(data) => {
                    update(item, data);
                  }}
                >
                  <For each={item.dataSource}>
                    {(data) => (
                      <RadioGroupItem value={data.key}>
                        <Label>{data.text}</Label>
                      </RadioGroupItem>
                    )}
                  </For>
                </RadioGroup>
              </>
            );
          }
          return <>{item.text}</>;
        })}
      </div>
    </Modal>
  )
}

export default SettingModal
