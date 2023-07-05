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

import { Button, ButtonProps } from '../ui/button'
import { JSX, ParentComponent, ParentProps } from 'solid-js'

import { Label } from '../ui/label'
import { Separator } from '../ui/separator'

export interface ModalProps extends ParentProps {
  width?: number
  title?: JSX.Element
  buttons?: ButtonProps[]
  onClose?: () => void
}

const Modal: ParentComponent<ModalProps> = (props) => {
  return (
    <div
      class="fixed inset-0 z-50 flex">
      <div
        onClick={props.onClose}
        class='fixed w-screen inset-0 z-40 bg-black/40 transition-all duration-100' />
      <div class='fixed right-0 z-50 scale-100 gap-4 bg-[#191925] p-6 opacity-100 shadow-lg overflow-y-auto w-[300px] h-full animate-in slide-in-from-right duration-300'>
        <Label class='text-white text-[18px]'>{props.title}</Label>
        <div class='overflow-y-auto'>
          {props.children}
        </div>
        <Separator class='my-4'/>
        {
          (props.buttons && props.buttons.length > 0) && (
            <div
              class="flex justify-around">
              {
                props.buttons.map(button => {
                  return (
                    <Button type='button' {...button} class='bg-card'>
                      {button.children}
                    </Button>
                  )
                })
              }
            </div>
          )
        }
      </div>
    </div>
  )
}

export default Modal
