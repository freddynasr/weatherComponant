import { Component, h } from '@stencil/core';

@Component({
  tag: 'at-spinner',
  styleUrl: 'spinner.css',
  shadow: true,
})
export class spinner {
  render() {
    return (
      <div class="lds-facebook">
        <div></div>
        <div></div>
        <div></div>
      </div>
    );
  }
}
