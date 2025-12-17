// Defining the styles for our component...
const styles = new CSSStyleSheet();
const cssText = `
  :host {
    display: inline-block;
    font-family: sans-serif;
    padding: 1rem;
    --status-color: #e65100; /* Default, pending status... */
  }

  :host([status="rejected" i]) {
    --status-color: #8c2618;
  }
  
  :host([status="accepted" i]) {
    --status-color: #1b5e20;
  }

  .widget {
    display: flex;
    flex-direction: column;
    border-radius: 5px;
    padding: 1rem;
  }

  .value {
    font-size: 3rem;
    line-height: 1;
    margin-bottom: 0.5rem;
  }

  .label {
    margin-bottom: 0.75rem;
  }

  .status-badge {
    display: inline-flex;
    align-items: center;
    color: var(--status-color);
    font-size: 1rem;
  }

  .status-text {
    padding-left: 0.2rem;
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    background-color: var(--status-color);
    color: white;
    border-radius: 50%;
    font-size: 0.8rem;
    font-weight: bold;
  }
`;
styles.replaceSync(cssText);

/**
 * @element adp-status-widget
 *
 * @description
 * Displays a statistical value with a label and a status indicator.
 *
 * @attr {string} value
 * Main value displayed in the widget.
 *
 * @attr {string} label
 * Descriptive label for the value.
 *
 * @attr {"accepted" | "rejected" | "pending"} status
 * Current status (case-insensitive).
 *
 * @example
 * <adp-status-widget value="3" label="Tasks" status="pending"></adp-status-widget>
 */
class AdpStatusWidget extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // Applying the styles
    if ("adoptedStyleSheets" in Document.prototype) {
      // Modern browsers
      this.shadowRoot.adoptedStyleSheets = [styles];
    } else {
      // Fallback for older browsers
      const style = document.createElement("style");
      style.textContent = cssText;
      this.shadowRoot.appendChild(style);
    }
  }

  static get observedAttributes() {
    return ['value', 'label', 'status'];
  }

  attributeChangedCallback(_name, oldValue, newValue) {
    // If any values change, it should render the component
    if (oldValue !== newValue) {
      this.render();
    }
  }

  connectedCallback() {
    this.render();
  }

  getIcon(status) {
    const s = status ? status.toLowerCase() : '';
    if (s === 'rejected') return '!';
    if (s === 'accepted') return '✓';
    return '?';
  }

  render() {
    // Defining some default values for our component...
    const value = this.getAttribute('value') || '0';
    const label = this.getAttribute('label') || 'Label';
    const status = this.getAttribute('status') || 'Pending';

    // Expose a readable label for screen readers
    this.setAttribute(
      'aria-label',
      `${label}: ${value}. Status: ${status}.`
    );

    // Creating the content root element
    if (!this.contentRoot) {
      this.contentRoot = document.createElement("div");
      this.shadowRoot.appendChild(this.contentRoot);
    }

    // Setting the final HTML layout for our widget...
    this.contentRoot.innerHTML = `
      <div class="widget">
        <div class="value">${value}</div>
        <div class="label">${label}</div>
        <div class="status-badge">
          <span class="icon">${this.getIcon(status)}</span>
          <span class="status-text">${status}</span>
        </div>
      </div>
    `;
  }
}

if (!customElements.get('adp-status-widget')) {
  customElements.define('adp-status-widget', AdpStatusWidget);
}