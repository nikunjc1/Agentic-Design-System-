---
project: "design system"
version: "3.5.0-local-draft"
generated: "2026-11-06T10:20:01.679Z"
scope: "documentation-and-context"
---

# design system

## Product context

- Product: Not configured
- Delivery role: Not configured

## Target platforms

## Agent instructions

- Use the saved foundation values below. Reuse documented components and semantic tokens.
- Keep accessible names, keyboard behavior, focus management, and loading, empty, error and success states explicit.
- Support reduced motion, text resizing, localization and touch input.
- Treat demo states as illustrations; verify interactive behavior in the implementation.
- Native mobile and desktop targets require platform-specific component implementations.
- This is a local working snapshot. It does not imply a published npm package, authenticated account, or backend service.

## Saved foundation values

```json
{
  "colors": null,
  "bg-colors": null,
  "status-colors": null,
  "neutral-colors": null,
  "grid-layout": null,
  "typography": null,
  "spacing": null,
  "radius": null,
  "border": null,
  "border-states": null,
  "shadow": null,
  "icons": null,
  "units": null,
  "sizing": null,
  "data-format": null,
  "resolvedFoundation": {
    "version": 1,
    "unit": "px",
    "theme": "light",
    "tokens": {
      "--graphite-950": "#f6f6f4",
      "--graphite-900": "#ffffff",
      "--graphite-850": "#fbfbfa",
      "--graphite-800": "#f1f1ee",
      "--graphite-700": "#e3e3df",
      "--graphite-600": "#c7c7c1",
      "--graphite-500": "#8f918c",
      "--control-border": "#85888d",
      "--line": "rgba(15,15,10,0.08)",
      "--line-strong": "rgba(15,15,10,0.15)",
      "--border-width-0": "0px",
      "--border-width-1": "1px",
      "--border-width-1-5": "1.5px",
      "--border-width-2": "2px",
      "--border-width-3": "3px",
      "--border-width-4": "4px",
      "--text-hi": "var(--type-h6-color)",
      "--text-mid": "var(--type-body-color)",
      "--text-dim": "var(--type-caption-color)",
      "--overlay-invert-bg": "#15171a",
      "--overlay-invert-text": "#ffffff",
      "--overlay-invert-amber": "#e6a53a",
      "--opacity-40": "0.4",
      "--opacity-50": "0.5",
      "--color-focus-ring": "var(--border-state-focus)",
      "--color-on-brand": "var(--on-brand-text)",
      "--on-brand-text": "#FFFFFF",
      "--red-500": "#FF031A",
      "--red-400": "#ff4253",
      "--red-600": "#d10215",
      "--red-glow": "rgba(255,3,26,0.35)",
      "--red-tint": "rgba(255,3,26,0.08)",
      "--brand-500": "var(--red-500)",
      "--brand-400": "var(--red-400)",
      "--brand-600": "var(--red-600)",
      "--brand-glow": "var(--red-glow)",
      "--brand-tint": "var(--red-tint)",
      "--surface-page": "var(--graphite-950)",
      "--surface-panel": "var(--graphite-900)",
      "--surface-raised": "var(--graphite-850)",
      "--green-500": "#2fbf6e",
      "--amber-500": "#e6a53a",
      "--danger-500": "#ff031a",
      "--danger-400": "#ff4253",
      "--danger-600": "#d10215",
      "--blue-500": "#4f8fe6",
      "--tracking-tight": "-0.01em",
      "--tracking-2": "0.02em",
      "--tracking-3": "0.03em",
      "--tracking-4": "0.04em",
      "--tracking-5": "0.05em",
      "--tracking-6": "0.06em",
      "--tracking-8": "0.08em",
      "--tracking-10": "0.1em",
      "--tracking-12": "0.12em",
      "--tracking-14": "0.14em",
      "--font-display": "\"Inter\", ui-sans-serif, system-ui, sans-serif",
      "--font-body": "\"Inter\", ui-sans-serif, system-ui, sans-serif",
      "--font-mono": "\"JetBrains Mono\", ui-monospace, \"SFMono-Regular\", monospace",
      "--numeric-tabular": "tabular-nums",
      "--radius-none": "0px",
      "--radius-2": "2px",
      "--radius-sm": "4px",
      "--radius-6": "6px",
      "--radius-md": "8px",
      "--radius-12": "12px",
      "--radius-16": "16px",
      "--radius-24": "24px",
      "--radius-full": "9999px",
      "--space-4": "4px",
      "--space-8": "8px",
      "--space-12": "12px",
      "--space-16": "16px",
      "--space-20": "20px",
      "--space-24": "24px",
      "--space-28": "28px",
      "--space-32": "32px",
      "--space-40": "40px",
      "--space-48": "48px",
      "--space-56": "56px",
      "--space-64": "64px",
      "--space-72": "72px",
      "--space-80": "80px",
      "--space-96": "96px",
      "--space-112": "112px",
      "--space-128": "128px",
      "--shadow-none": "none",
      "--shadow-xs": "0 1px 2px rgba(0,0,0,0.06)",
      "--shadow-sm": "0 1px 4px rgba(0,0,0,0.08)",
      "--shadow-md": "0 4px 8px rgba(0,0,0,0.1)",
      "--shadow-lg": "0 8px 16px rgba(0,0,0,0.12)",
      "--shadow-xl": "0 12px 24px rgba(0,0,0,0.14)",
      "--shadow-2xl": "0 16px 32px rgba(0,0,0,0.16)",
      "--overlay-scrim": "rgba(0,0,0,0.55)",
      "--duration-fast": "0.12s",
      "--duration-base": "0.15s",
      "--duration-slow": "0.8s",
      "--duration-shimmer": "1.5s",
      "--ease-standard": "ease",
      "--ease-emphasis": "ease-in-out",
      "--ease-linear": "linear",
      "--button-primary-bg-default": "var(--red-500)",
      "--button-primary-bg-hover": "var(--red-400)",
      "--button-primary-bg-active": "var(--red-600)",
      "--button-primary-text": "var(--color-on-brand)",
      "--button-primary-text-default": "#FFFFFF",
      "--button-primary-text-hover": "#FFFFFF",
      "--button-primary-text-active": "#FFFFFF",
      "--button-primary-focus-ring": "var(--color-focus-ring)",
      "--button-primary-disabled-opacity": "0.45",
      "--table-cell-padding-y-default": "var(--space-8)",
      "--table-cell-padding-y-compact": "var(--space-4)",
      "--table-header-text": "var(--text-dim)",
      "--table-border-color": "var(--line)",
      "--modal-scrim": "var(--overlay-scrim)",
      "--modal-surface": "var(--graphite-900)",
      "--modal-shadow": "var(--shadow-xl)",
      "--modal-border-color": "var(--line-strong)",
      "--card-surface": "var(--graphite-900)",
      "--card-border-color": "var(--line-strong)",
      "--card-shadow-rest": "var(--shadow-sm)",
      "--card-shadow-hover": "var(--shadow-md)",
      "--card-shadow-pressed": "var(--shadow-xs)",
      "--status-success-text": "#000000",
      "--status-warning-text": "#000000",
      "--status-danger-text": "#000000",
      "--status-info-text": "#000000",
      "--link-text": "#e60317",
      "--color-ai-accent": "#8b5cf6",
      "--color-ai-accent-strong": "#7c3aed",
      "--color-ai-accent-tint": "rgba(139,92,246,0.12)",
      "--color-ai-confidence-high": "var(--green-700)",
      "--color-ai-confidence-medium": "#986d26",
      "--color-ai-confidence-low": "var(--danger-700)",
      "--color-agent-success": "var(--green-500)",
      "--color-agent-failure": "var(--danger-500)",
      "--type-h1-family": "var(--font-display)",
      "--type-h1-size": "32px",
      "--type-h1-line-height": "1.25",
      "--type-h1-weight": "700",
      "--type-h1-style": "normal",
      "--type-h1-tracking": "0px",
      "--type-h1-color": "#111827",
      "--type-h2-family": "var(--font-display)",
      "--type-h2-size": "28px",
      "--type-h2-line-height": "1.29",
      "--type-h2-weight": "700",
      "--type-h2-style": "normal",
      "--type-h2-tracking": "0px",
      "--type-h2-color": "#111827",
      "--type-h3-family": "var(--font-display)",
      "--type-h3-size": "24px",
      "--type-h3-line-height": "1.33",
      "--type-h3-weight": "600",
      "--type-h3-style": "normal",
      "--type-h3-tracking": "0px",
      "--type-h3-color": "#111827",
      "--type-h4-family": "var(--font-display)",
      "--type-h4-size": "20px",
      "--type-h4-line-height": "1.4",
      "--type-h4-weight": "600",
      "--type-h4-style": "normal",
      "--type-h4-tracking": "0px",
      "--type-h4-color": "#111827",
      "--type-h5-family": "var(--font-display)",
      "--type-h5-size": "18px",
      "--type-h5-line-height": "1.44",
      "--type-h5-weight": "500",
      "--type-h5-style": "normal",
      "--type-h5-tracking": "0px",
      "--type-h5-color": "#111827",
      "--type-h6-family": "var(--font-display)",
      "--type-h6-size": "16px",
      "--type-h6-line-height": "1.5",
      "--type-h6-weight": "500",
      "--type-h6-style": "normal",
      "--type-h6-tracking": "0px",
      "--type-h6-color": "#111827",
      "--type-body-family": "var(--font-body)",
      "--type-body-size": "16px",
      "--type-body-line-height": "1.5",
      "--type-body-weight": "400",
      "--type-body-style": "normal",
      "--type-body-tracking": "0px",
      "--type-body-color": "#4B5563",
      "--type-paragraph-family": "var(--font-body)",
      "--type-paragraph-size": "16px",
      "--type-paragraph-line-height": "1.5",
      "--type-paragraph-weight": "400",
      "--type-paragraph-style": "normal",
      "--type-paragraph-tracking": "0px",
      "--type-paragraph-color": "#4B5563",
      "--type-caption-family": "var(--font-body)",
      "--type-caption-size": "11px",
      "--type-caption-line-height": "1.5",
      "--type-caption-weight": "400",
      "--type-caption-style": "normal",
      "--type-caption-tracking": "0px",
      "--type-caption-color": "#69707D",
      "--type-active-family": "var(--font-body)",
      "--type-active-size": "14px",
      "--type-active-line-height": "1.43",
      "--type-active-weight": "500",
      "--type-active-style": "normal",
      "--type-active-tracking": "0px",
      "--type-active-color": "#E20317",
      "--type-selected-family": "var(--font-body)",
      "--type-selected-size": "14px",
      "--type-selected-line-height": "1.43",
      "--type-selected-weight": "600",
      "--type-selected-style": "normal",
      "--type-selected-tracking": "0px",
      "--type-selected-color": "#E20317",
      "--type-disabled-family": "var(--font-body)",
      "--type-disabled-size": "14px",
      "--type-disabled-line-height": "1.43",
      "--type-disabled-weight": "400",
      "--type-disabled-style": "normal",
      "--type-disabled-tracking": "0px",
      "--type-disabled-color": "#9CA3AF",
      "--type-error-family": "var(--font-body)",
      "--type-error-size": "14px",
      "--type-error-line-height": "1.43",
      "--type-error-weight": "500",
      "--type-error-style": "normal",
      "--type-error-tracking": "0px",
      "--type-error-color": "#D23441",
      "--type-warning-family": "var(--font-body)",
      "--type-warning-size": "14px",
      "--type-warning-line-height": "1.43",
      "--type-warning-weight": "500",
      "--type-warning-style": "normal",
      "--type-warning-tracking": "0px",
      "--type-warning-color": "#926924",
      "--type-success-family": "var(--font-body)",
      "--type-success-size": "14px",
      "--type-success-line-height": "1.43",
      "--type-success-weight": "500",
      "--type-success-style": "normal",
      "--type-success-tracking": "0px",
      "--type-success-color": "#20814A",
      "--type-info-family": "var(--font-body)",
      "--type-info-size": "14px",
      "--type-info-line-height": "1.43",
      "--type-info-weight": "500",
      "--type-info-style": "normal",
      "--type-info-tracking": "0px",
      "--type-info-color": "#3E70B5",
      "--green-700": "#21864d",
      "--danger-700": "#eb0318",
      "--red-700": "#eb0318",
      "--green-page-text": "#1d7644",
      "--danger-page-text": "#c70214",
      "--amber-page-text": "#8a6323",
      "--blue-page-text": "#3a6aaa",
      "--contrast-pass-bg": "#e6f7ee",
      "--contrast-pass-text": "#1f7e49",
      "--contrast-fail-bg": "#ffe1e4",
      "--contrast-fail-text": "#d10215",
      "--agent-approve-bg-default": "#d5f2e2",
      "--agent-approve-text-default": "#1d7644",
      "--agent-approve-bg-hover": "#c5edd6",
      "--agent-approve-text-hover": "#1c7342",
      "--agent-approve-bg-active": "#b4e8cb",
      "--agent-approve-text-active": "#1b6f40",
      "--agent-reject-bg-default": "#dbdde0",
      "--agent-reject-text-default": "#4b5563",
      "--agent-reject-bg-hover": "#cdcfd3",
      "--agent-reject-text-hover": "#4b5563",
      "--agent-reject-bg-active": "#bec2c7",
      "--agent-reject-text-active": "#47505d",
      "--color-brand": "var(--red-500)",
      "--color-action-default": "var(--red-500)",
      "--color-action-hover": "var(--red-400)",
      "--color-action-active": "var(--red-600)",
      "--color-text-primary": "var(--type-body-color)",
      "--color-text-caption": "var(--type-caption-color)",
      "--color-surface-page": "var(--graphite-950)",
      "--color-surface-panel": "var(--graphite-900)",
      "--color-surface-raised": "var(--graphite-850)",
      "--layer-content": "0",
      "--layer-sticky": "20",
      "--layer-popover": "40",
      "--layer-scrim": "60",
      "--layer-dialog": "70",
      "--layer-toast": "80",
      "--layer-tooltip": "90",
      "--space-1": "1px",
      "--space-2": "2px",
      "--space-3": "3px",
      "--space-5": "4px",
      "--space-6": "8px",
      "--space-7": "8px",
      "--space-9": "8px",
      "--space-10": "12px",
      "--space-11": "12px",
      "--space-13": "12px",
      "--space-14": "16px",
      "--space-15": "16px",
      "--space-17": "16px",
      "--space-18": "20px",
      "--space-19": "20px",
      "--space-21": "20px",
      "--space-22": "24px",
      "--space-23": "24px",
      "--space-25": "24px",
      "--space-26": "28px",
      "--space-27": "28px",
      "--space-29": "28px",
      "--space-30": "32px",
      "--space-31": "32px",
      "--space-33": "32px",
      "--space-34": "36px",
      "--space-35": "36px",
      "--space-36": "36px",
      "--space-37": "36px",
      "--space-38": "40px",
      "--space-39": "40px",
      "--space-41": "40px",
      "--space-42": "44px",
      "--space-43": "44px",
      "--space-44": "44px",
      "--space-45": "44px",
      "--space-46": "48px",
      "--space-47": "48px",
      "--space-49": "48px",
      "--space-50": "52px",
      "--space-51": "52px",
      "--space-52": "52px",
      "--space-53": "52px",
      "--space-54": "56px",
      "--space-55": "56px",
      "--space-57": "56px",
      "--space-58": "60px",
      "--space-59": "60px",
      "--space-60": "60px",
      "--space-61": "60px",
      "--space-62": "64px",
      "--space-63": "64px",
      "--space-65": "64px",
      "--space-66": "68px",
      "--space-67": "68px",
      "--space-68": "68px",
      "--space-69": "68px",
      "--space-70": "72px",
      "--space-71": "72px",
      "--space-73": "72px",
      "--space-74": "76px",
      "--space-75": "76px",
      "--space-76": "76px",
      "--space-77": "76px",
      "--space-78": "80px",
      "--space-79": "80px",
      "--space-81": "80px",
      "--space-82": "84px",
      "--space-83": "84px",
      "--space-84": "84px",
      "--space-85": "84px",
      "--space-86": "88px",
      "--space-87": "88px",
      "--space-88": "88px",
      "--space-89": "88px",
      "--space-90": "92px",
      "--space-91": "92px",
      "--space-92": "92px",
      "--space-93": "92px",
      "--space-94": "96px",
      "--space-95": "96px",
      "--space-97": "96px",
      "--space-98": "100px",
      "--space-99": "100px",
      "--space-100": "100px",
      "--space-101": "100px",
      "--space-102": "104px",
      "--space-103": "104px",
      "--space-104": "104px",
      "--space-105": "104px",
      "--space-106": "108px",
      "--space-107": "108px",
      "--space-108": "108px",
      "--space-109": "108px",
      "--space-110": "112px",
      "--space-111": "112px",
      "--space-113": "112px",
      "--space-114": "116px",
      "--space-115": "116px",
      "--space-116": "116px",
      "--space-117": "116px",
      "--space-118": "120px",
      "--space-119": "120px",
      "--space-120": "120px",
      "--space-121": "120px",
      "--space-122": "124px",
      "--space-123": "124px",
      "--space-124": "124px",
      "--space-125": "124px",
      "--space-126": "128px",
      "--space-127": "128px",
      "--space-129": "128px",
      "--space-130": "132px",
      "--space-131": "132px",
      "--space-132": "132px",
      "--space-133": "132px",
      "--space-134": "136px",
      "--space-135": "136px",
      "--space-136": "136px",
      "--space-137": "136px",
      "--space-138": "140px",
      "--space-139": "140px",
      "--space-140": "140px",
      "--space-141": "140px",
      "--space-142": "144px",
      "--space-143": "144px",
      "--space-144": "144px",
      "--space-145": "144px",
      "--space-146": "148px",
      "--space-147": "148px",
      "--space-148": "148px",
      "--space-149": "148px",
      "--space-150": "152px",
      "--space-151": "152px",
      "--space-152": "152px",
      "--space-153": "152px",
      "--space-154": "156px",
      "--space-155": "156px",
      "--space-156": "156px",
      "--space-157": "156px",
      "--space-158": "160px",
      "--space-159": "160px",
      "--space-160": "160px",
      "--space-161": "160px",
      "--space-162": "164px",
      "--space-163": "164px",
      "--space-164": "164px",
      "--space-165": "164px",
      "--space-166": "168px",
      "--space-167": "168px",
      "--space-168": "168px",
      "--space-169": "168px",
      "--space-170": "172px",
      "--space-171": "172px",
      "--space-172": "172px",
      "--space-173": "172px",
      "--space-174": "176px",
      "--space-175": "176px",
      "--space-176": "176px",
      "--space-177": "176px",
      "--space-178": "180px",
      "--space-179": "180px",
      "--space-180": "180px",
      "--space-181": "180px",
      "--space-182": "184px",
      "--space-183": "184px",
      "--space-184": "184px",
      "--space-185": "184px",
      "--space-186": "188px",
      "--space-187": "188px",
      "--space-188": "188px",
      "--space-189": "188px",
      "--space-190": "192px",
      "--space-191": "192px",
      "--space-192": "192px",
      "--space-193": "192px",
      "--space-194": "196px",
      "--space-195": "196px",
      "--space-196": "196px",
      "--space-197": "196px",
      "--space-198": "200px",
      "--space-199": "200px",
      "--space-200": "200px",
      "--space-201": "200px",
      "--space-202": "204px",
      "--space-203": "204px",
      "--space-204": "204px",
      "--space-205": "204px",
      "--space-206": "208px",
      "--space-207": "208px",
      "--space-208": "208px",
      "--space-209": "208px",
      "--space-210": "212px",
      "--space-211": "212px",
      "--space-212": "212px",
      "--space-213": "212px",
      "--space-214": "216px",
      "--space-215": "216px",
      "--space-216": "216px",
      "--space-217": "216px",
      "--space-218": "220px",
      "--space-219": "220px",
      "--space-220": "220px",
      "--space-221": "220px",
      "--space-222": "224px",
      "--space-223": "224px",
      "--space-224": "224px",
      "--space-225": "224px",
      "--space-226": "228px",
      "--space-227": "228px",
      "--space-228": "228px",
      "--space-229": "228px",
      "--space-230": "232px",
      "--space-231": "232px",
      "--space-232": "232px",
      "--space-233": "232px",
      "--space-234": "236px",
      "--space-235": "236px",
      "--space-236": "236px",
      "--space-237": "236px",
      "--space-238": "240px",
      "--space-239": "240px",
      "--space-240": "240px",
      "--space-241": "240px",
      "--space-242": "244px",
      "--space-243": "244px",
      "--space-244": "244px",
      "--space-245": "244px",
      "--space-246": "248px",
      "--space-247": "248px",
      "--space-248": "248px",
      "--space-249": "248px",
      "--space-250": "252px",
      "--space-251": "252px",
      "--space-252": "252px",
      "--space-253": "252px",
      "--space-254": "256px",
      "--space-255": "256px",
      "--space-256": "256px",
      "--space-label-gap": "var(--space-8)",
      "--space-helper-gap": "var(--space-4)",
      "--space-field-gap": "var(--space-16)",
      "--space-icon-gap": "var(--space-8)",
      "--space-panel-padding": "var(--space-24)",
      "--space-group-gap": "var(--space-32)",
      "--dimension-1": "1px",
      "--dimension-2": "2px",
      "--dimension-3": "3px",
      "--dimension-4": "4px",
      "--dimension-5": "5px",
      "--dimension-6": "6px",
      "--dimension-7": "7px",
      "--dimension-8": "8px",
      "--dimension-9": "9px",
      "--dimension-10": "10px",
      "--dimension-11": "11px",
      "--dimension-12": "12px",
      "--dimension-13": "13px",
      "--dimension-14": "14px",
      "--dimension-15": "15px",
      "--dimension-16": "16px",
      "--dimension-18": "18px",
      "--dimension-19": "19px",
      "--dimension-20": "20px",
      "--dimension-22": "22px",
      "--dimension-24": "24px",
      "--dimension-26": "26px",
      "--dimension-28": "28px",
      "--dimension-32": "32px",
      "--dimension-34": "34px",
      "--dimension-35": "35px",
      "--dimension-36": "36px",
      "--dimension-38": "38px",
      "--dimension-40": "40px",
      "--dimension-42": "42px",
      "--dimension-44": "44px",
      "--dimension-48": "48px",
      "--dimension-49": "49px",
      "--dimension-56": "56px",
      "--dimension-60": "60px",
      "--dimension-64": "64px",
      "--dimension-65": "65px",
      "--dimension-72": "72px",
      "--dimension-76": "76px",
      "--dimension-80": "80px",
      "--dimension-84": "84px",
      "--dimension-90": "90px",
      "--dimension-91": "91px",
      "--dimension-96": "96px",
      "--dimension-100": "100px",
      "--dimension-104": "104px",
      "--dimension-105": "105px",
      "--dimension-110": "110px",
      "--dimension-120": "120px",
      "--dimension-122": "122px",
      "--dimension-130": "130px",
      "--dimension-140": "140px",
      "--dimension-141": "141px",
      "--dimension-150": "150px",
      "--dimension-160": "160px",
      "--dimension-170": "170px",
      "--dimension-179": "179px",
      "--dimension-180": "180px",
      "--dimension-190": "190px",
      "--dimension-200": "200px",
      "--dimension-208": "208px",
      "--dimension-220": "220px",
      "--dimension-222": "222px",
      "--dimension-228": "228px",
      "--dimension-240": "240px",
      "--dimension-252": "252px",
      "--dimension-260": "260px",
      "--dimension-264": "264px",
      "--dimension-268": "268px",
      "--dimension-280": "280px",
      "--dimension-300": "300px",
      "--dimension-320": "320px",
      "--dimension-340": "340px",
      "--dimension-360": "360px",
      "--dimension-370": "370px",
      "--dimension-400": "400px",
      "--dimension-420": "420px",
      "--dimension-440": "440px",
      "--dimension-465": "465px",
      "--dimension-480": "480px",
      "--dimension-483": "483px",
      "--dimension-490": "490px",
      "--dimension-520": "520px",
      "--dimension-560": "560px",
      "--dimension-600": "600px",
      "--dimension-630": "630px",
      "--dimension-640": "640px",
      "--dimension-670": "670px",
      "--dimension-680": "680px",
      "--dimension-800": "800px",
      "--dimension-820": "820px",
      "--dimension-1352": "1352px",
      "--radius-4": "4px",
      "--radius-8": "8px",
      "--radius-20": "20px",
      "--radius-32": "32px",
      "--radius-40": "40px",
      "--radius-lg": "16px",
      "--border-style": "solid",
      "--border-sides": "all",
      "--border-state-focus": "var(--red-500)",
      "--focus-ring-width": "2px",
      "--size-control": "40px",
      "--size-target": "44px",
      "--size-icon": "24px",
      "--size-content": "1200px",
      "--size-sidebar": "264px",
      "--icon-size": "24px",
      "--icon-stroke": "1.8",
      "--icon-cap": "round",
      "--icon-join": "round",
      "--grid-columns": "12",
      "--grid-gutter": "24px"
    },
    "dataFormat": {
      "locale": "en-GB",
      "grouping": true,
      "separator": "locale",
      "unit": "kg",
      "unitSpace": "none",
      "currency": "GBP",
      "currencyDisplay": "symbol",
      "decimals": 2,
      "large": "compact",
      "tableAlign": "end",
      "date": "iso",
      "hourCycle": "h23",
      "seconds": false,
      "combined": "space",
      "relative": true,
      "zone": "UTC",
      "showZone": true,
      "range": " – ",
      "noValue": "–",
      "loading": "skeleton",
      "redaction": "partial",
      "mask": "*",
      "reveal": 4,
      "escapedSpace": "space"
    },
    "gridSystem": "columns",
    "iconStyle": "duotone"
  },
  "resolvedThemes": {
    "light": {
      "version": 1,
      "unit": "px",
      "theme": "light",
      "tokens": {
        "--graphite-950": "#f6f6f4",
        "--graphite-900": "#ffffff",
        "--graphite-850": "#fbfbfa",
        "--graphite-800": "#f1f1ee",
        "--graphite-700": "#e3e3df",
        "--graphite-600": "#c7c7c1",
        "--graphite-500": "#8f918c",
        "--control-border": "#85888d",
        "--line": "rgba(15,15,10,0.08)",
        "--line-strong": "rgba(15,15,10,0.15)",
        "--border-width-0": "0px",
        "--border-width-1": "1px",
        "--border-width-1-5": "1.5px",
        "--border-width-2": "2px",
        "--border-width-3": "3px",
        "--border-width-4": "4px",
        "--text-hi": "var(--type-h6-color)",
        "--text-mid": "var(--type-body-color)",
        "--text-dim": "var(--type-caption-color)",
        "--overlay-invert-bg": "#15171a",
        "--overlay-invert-text": "#ffffff",
        "--overlay-invert-amber": "#e6a53a",
        "--opacity-40": "0.4",
        "--opacity-50": "0.5",
        "--color-focus-ring": "var(--border-state-focus)",
        "--color-on-brand": "var(--on-brand-text)",
        "--on-brand-text": "#FFFFFF",
        "--red-500": "#FF031A",
        "--red-400": "#ff4253",
        "--red-600": "#d10215",
        "--red-glow": "rgba(255,3,26,0.35)",
        "--red-tint": "rgba(255,3,26,0.08)",
        "--brand-500": "var(--red-500)",
        "--brand-400": "var(--red-400)",
        "--brand-600": "var(--red-600)",
        "--brand-glow": "var(--red-glow)",
        "--brand-tint": "var(--red-tint)",
        "--surface-page": "var(--graphite-950)",
        "--surface-panel": "var(--graphite-900)",
        "--surface-raised": "var(--graphite-850)",
        "--green-500": "#2fbf6e",
        "--amber-500": "#e6a53a",
        "--danger-500": "#ff031a",
        "--danger-400": "#ff4253",
        "--danger-600": "#d10215",
        "--blue-500": "#4f8fe6",
        "--tracking-tight": "-0.01em",
        "--tracking-2": "0.02em",
        "--tracking-3": "0.03em",
        "--tracking-4": "0.04em",
        "--tracking-5": "0.05em",
        "--tracking-6": "0.06em",
        "--tracking-8": "0.08em",
        "--tracking-10": "0.1em",
        "--tracking-12": "0.12em",
        "--tracking-14": "0.14em",
        "--font-display": "\"Inter\", ui-sans-serif, system-ui, sans-serif",
        "--font-body": "\"Inter\", ui-sans-serif, system-ui, sans-serif",
        "--font-mono": "\"JetBrains Mono\", ui-monospace, \"SFMono-Regular\", monospace",
        "--numeric-tabular": "tabular-nums",
        "--radius-none": "0px",
        "--radius-2": "2px",
        "--radius-sm": "4px",
        "--radius-6": "6px",
        "--radius-md": "8px",
        "--radius-12": "12px",
        "--radius-16": "16px",
        "--radius-24": "24px",
        "--radius-full": "9999px",
        "--space-4": "4px",
        "--space-8": "8px",
        "--space-12": "12px",
        "--space-16": "16px",
        "--space-20": "20px",
        "--space-24": "24px",
        "--space-28": "28px",
        "--space-32": "32px",
        "--space-40": "40px",
        "--space-48": "48px",
        "--space-56": "56px",
        "--space-64": "64px",
        "--space-72": "72px",
        "--space-80": "80px",
        "--space-96": "96px",
        "--space-112": "112px",
        "--space-128": "128px",
        "--shadow-none": "none",
        "--shadow-xs": "0 1px 2px rgba(0,0,0,0.06)",
        "--shadow-sm": "0 1px 4px rgba(0,0,0,0.08)",
        "--shadow-md": "0 4px 8px rgba(0,0,0,0.1)",
        "--shadow-lg": "0 8px 16px rgba(0,0,0,0.12)",
        "--shadow-xl": "0 12px 24px rgba(0,0,0,0.14)",
        "--shadow-2xl": "0 16px 32px rgba(0,0,0,0.16)",
        "--overlay-scrim": "rgba(0,0,0,0.55)",
        "--duration-fast": "0.12s",
        "--duration-base": "0.15s",
        "--duration-slow": "0.8s",
        "--duration-shimmer": "1.5s",
        "--ease-standard": "ease",
        "--ease-emphasis": "ease-in-out",
        "--ease-linear": "linear",
        "--button-primary-bg-default": "var(--red-500)",
        "--button-primary-bg-hover": "var(--red-400)",
        "--button-primary-bg-active": "var(--red-600)",
        "--button-primary-text": "var(--color-on-brand)",
        "--button-primary-text-default": "#FFFFFF",
        "--button-primary-text-hover": "#FFFFFF",
        "--button-primary-text-active": "#FFFFFF",
        "--button-primary-focus-ring": "var(--color-focus-ring)",
        "--button-primary-disabled-opacity": "0.45",
        "--table-cell-padding-y-default": "var(--space-8)",
        "--table-cell-padding-y-compact": "var(--space-4)",
        "--table-header-text": "var(--text-dim)",
        "--table-border-color": "var(--line)",
        "--modal-scrim": "var(--overlay-scrim)",
        "--modal-surface": "var(--graphite-900)",
        "--modal-shadow": "var(--shadow-xl)",
        "--modal-border-color": "var(--line-strong)",
        "--card-surface": "var(--graphite-900)",
        "--card-border-color": "var(--line-strong)",
        "--card-shadow-rest": "var(--shadow-sm)",
        "--card-shadow-hover": "var(--shadow-md)",
        "--card-shadow-pressed": "var(--shadow-xs)",
        "--status-success-text": "#000000",
        "--status-warning-text": "#000000",
        "--status-danger-text": "#000000",
        "--status-info-text": "#000000",
        "--link-text": "#e60317",
        "--color-ai-accent": "#8b5cf6",
        "--color-ai-accent-strong": "#7c3aed",
        "--color-ai-accent-tint": "rgba(139,92,246,0.12)",
        "--color-ai-confidence-high": "var(--green-700)",
        "--color-ai-confidence-medium": "#986d26",
        "--color-ai-confidence-low": "var(--danger-700)",
        "--color-agent-success": "var(--green-500)",
        "--color-agent-failure": "var(--danger-500)",
        "--type-h1-family": "var(--font-display)",
        "--type-h1-size": "32px",
        "--type-h1-line-height": "1.25",
        "--type-h1-weight": "700",
        "--type-h1-style": "normal",
        "--type-h1-tracking": "0px",
        "--type-h1-color": "#111827",
        "--type-h2-family": "var(--font-display)",
        "--type-h2-size": "28px",
        "--type-h2-line-height": "1.29",
        "--type-h2-weight": "700",
        "--type-h2-style": "normal",
        "--type-h2-tracking": "0px",
        "--type-h2-color": "#111827",
        "--type-h3-family": "var(--font-display)",
        "--type-h3-size": "24px",
        "--type-h3-line-height": "1.33",
        "--type-h3-weight": "600",
        "--type-h3-style": "normal",
        "--type-h3-tracking": "0px",
        "--type-h3-color": "#111827",
        "--type-h4-family": "var(--font-display)",
        "--type-h4-size": "20px",
        "--type-h4-line-height": "1.4",
        "--type-h4-weight": "600",
        "--type-h4-style": "normal",
        "--type-h4-tracking": "0px",
        "--type-h4-color": "#111827",
        "--type-h5-family": "var(--font-display)",
        "--type-h5-size": "18px",
        "--type-h5-line-height": "1.44",
        "--type-h5-weight": "500",
        "--type-h5-style": "normal",
        "--type-h5-tracking": "0px",
        "--type-h5-color": "#111827",
        "--type-h6-family": "var(--font-display)",
        "--type-h6-size": "16px",
        "--type-h6-line-height": "1.5",
        "--type-h6-weight": "500",
        "--type-h6-style": "normal",
        "--type-h6-tracking": "0px",
        "--type-h6-color": "#111827",
        "--type-body-family": "var(--font-body)",
        "--type-body-size": "16px",
        "--type-body-line-height": "1.5",
        "--type-body-weight": "400",
        "--type-body-style": "normal",
        "--type-body-tracking": "0px",
        "--type-body-color": "#4B5563",
        "--type-paragraph-family": "var(--font-body)",
        "--type-paragraph-size": "16px",
        "--type-paragraph-line-height": "1.5",
        "--type-paragraph-weight": "400",
        "--type-paragraph-style": "normal",
        "--type-paragraph-tracking": "0px",
        "--type-paragraph-color": "#4B5563",
        "--type-caption-family": "var(--font-body)",
        "--type-caption-size": "11px",
        "--type-caption-line-height": "1.5",
        "--type-caption-weight": "400",
        "--type-caption-style": "normal",
        "--type-caption-tracking": "0px",
        "--type-caption-color": "#69707D",
        "--type-active-family": "var(--font-body)",
        "--type-active-size": "14px",
        "--type-active-line-height": "1.43",
        "--type-active-weight": "500",
        "--type-active-style": "normal",
        "--type-active-tracking": "0px",
        "--type-active-color": "#E20317",
        "--type-selected-family": "var(--font-body)",
        "--type-selected-size": "14px",
        "--type-selected-line-height": "1.43",
        "--type-selected-weight": "600",
        "--type-selected-style": "normal",
        "--type-selected-tracking": "0px",
        "--type-selected-color": "#E20317",
        "--type-disabled-family": "var(--font-body)",
        "--type-disabled-size": "14px",
        "--type-disabled-line-height": "1.43",
        "--type-disabled-weight": "400",
        "--type-disabled-style": "normal",
        "--type-disabled-tracking": "0px",
        "--type-disabled-color": "#9CA3AF",
        "--type-error-family": "var(--font-body)",
        "--type-error-size": "14px",
        "--type-error-line-height": "1.43",
        "--type-error-weight": "500",
        "--type-error-style": "normal",
        "--type-error-tracking": "0px",
        "--type-error-color": "#D23441",
        "--type-warning-family": "var(--font-body)",
        "--type-warning-size": "14px",
        "--type-warning-line-height": "1.43",
        "--type-warning-weight": "500",
        "--type-warning-style": "normal",
        "--type-warning-tracking": "0px",
        "--type-warning-color": "#926924",
        "--type-success-family": "var(--font-body)",
        "--type-success-size": "14px",
        "--type-success-line-height": "1.43",
        "--type-success-weight": "500",
        "--type-success-style": "normal",
        "--type-success-tracking": "0px",
        "--type-success-color": "#20814A",
        "--type-info-family": "var(--font-body)",
        "--type-info-size": "14px",
        "--type-info-line-height": "1.43",
        "--type-info-weight": "500",
        "--type-info-style": "normal",
        "--type-info-tracking": "0px",
        "--type-info-color": "#3E70B5",
        "--green-700": "#21864d",
        "--danger-700": "#eb0318",
        "--red-700": "#eb0318",
        "--green-page-text": "#1d7644",
        "--danger-page-text": "#c70214",
        "--amber-page-text": "#8a6323",
        "--blue-page-text": "#3a6aaa",
        "--contrast-pass-bg": "#e6f7ee",
        "--contrast-pass-text": "#1f7e49",
        "--contrast-fail-bg": "#ffe1e4",
        "--contrast-fail-text": "#d10215",
        "--agent-approve-bg-default": "#d5f2e2",
        "--agent-approve-text-default": "#1d7644",
        "--agent-approve-bg-hover": "#c5edd6",
        "--agent-approve-text-hover": "#1c7342",
        "--agent-approve-bg-active": "#b4e8cb",
        "--agent-approve-text-active": "#1b6f40",
        "--agent-reject-bg-default": "#dbdde0",
        "--agent-reject-text-default": "#4b5563",
        "--agent-reject-bg-hover": "#cdcfd3",
        "--agent-reject-text-hover": "#4b5563",
        "--agent-reject-bg-active": "#bec2c7",
        "--agent-reject-text-active": "#47505d",
        "--color-brand": "var(--red-500)",
        "--color-action-default": "var(--red-500)",
        "--color-action-hover": "var(--red-400)",
        "--color-action-active": "var(--red-600)",
        "--color-text-primary": "var(--type-body-color)",
        "--color-text-caption": "var(--type-caption-color)",
        "--color-surface-page": "var(--graphite-950)",
        "--color-surface-panel": "var(--graphite-900)",
        "--color-surface-raised": "var(--graphite-850)",
        "--layer-content": "0",
        "--layer-sticky": "20",
        "--layer-popover": "40",
        "--layer-scrim": "60",
        "--layer-dialog": "70",
        "--layer-toast": "80",
        "--layer-tooltip": "90",
        "--space-1": "1px",
        "--space-2": "2px",
        "--space-3": "3px",
        "--space-5": "4px",
        "--space-6": "8px",
        "--space-7": "8px",
        "--space-9": "8px",
        "--space-10": "12px",
        "--space-11": "12px",
        "--space-13": "12px",
        "--space-14": "16px",
        "--space-15": "16px",
        "--space-17": "16px",
        "--space-18": "20px",
        "--space-19": "20px",
        "--space-21": "20px",
        "--space-22": "24px",
        "--space-23": "24px",
        "--space-25": "24px",
        "--space-26": "28px",
        "--space-27": "28px",
        "--space-29": "28px",
        "--space-30": "32px",
        "--space-31": "32px",
        "--space-33": "32px",
        "--space-34": "36px",
        "--space-35": "36px",
        "--space-36": "36px",
        "--space-37": "36px",
        "--space-38": "40px",
        "--space-39": "40px",
        "--space-41": "40px",
        "--space-42": "44px",
        "--space-43": "44px",
        "--space-44": "44px",
        "--space-45": "44px",
        "--space-46": "48px",
        "--space-47": "48px",
        "--space-49": "48px",
        "--space-50": "52px",
        "--space-51": "52px",
        "--space-52": "52px",
        "--space-53": "52px",
        "--space-54": "56px",
        "--space-55": "56px",
        "--space-57": "56px",
        "--space-58": "60px",
        "--space-59": "60px",
        "--space-60": "60px",
        "--space-61": "60px",
        "--space-62": "64px",
        "--space-63": "64px",
        "--space-65": "64px",
        "--space-66": "68px",
        "--space-67": "68px",
        "--space-68": "68px",
        "--space-69": "68px",
        "--space-70": "72px",
        "--space-71": "72px",
        "--space-73": "72px",
        "--space-74": "76px",
        "--space-75": "76px",
        "--space-76": "76px",
        "--space-77": "76px",
        "--space-78": "80px",
        "--space-79": "80px",
        "--space-81": "80px",
        "--space-82": "84px",
        "--space-83": "84px",
        "--space-84": "84px",
        "--space-85": "84px",
        "--space-86": "88px",
        "--space-87": "88px",
        "--space-88": "88px",
        "--space-89": "88px",
        "--space-90": "92px",
        "--space-91": "92px",
        "--space-92": "92px",
        "--space-93": "92px",
        "--space-94": "96px",
        "--space-95": "96px",
        "--space-97": "96px",
        "--space-98": "100px",
        "--space-99": "100px",
        "--space-100": "100px",
        "--space-101": "100px",
        "--space-102": "104px",
        "--space-103": "104px",
        "--space-104": "104px",
        "--space-105": "104px",
        "--space-106": "108px",
        "--space-107": "108px",
        "--space-108": "108px",
        "--space-109": "108px",
        "--space-110": "112px",
        "--space-111": "112px",
        "--space-113": "112px",
        "--space-114": "116px",
        "--space-115": "116px",
        "--space-116": "116px",
        "--space-117": "116px",
        "--space-118": "120px",
        "--space-119": "120px",
        "--space-120": "120px",
        "--space-121": "120px",
        "--space-122": "124px",
        "--space-123": "124px",
        "--space-124": "124px",
        "--space-125": "124px",
        "--space-126": "128px",
        "--space-127": "128px",
        "--space-129": "128px",
        "--space-130": "132px",
        "--space-131": "132px",
        "--space-132": "132px",
        "--space-133": "132px",
        "--space-134": "136px",
        "--space-135": "136px",
        "--space-136": "136px",
        "--space-137": "136px",
        "--space-138": "140px",
        "--space-139": "140px",
        "--space-140": "140px",
        "--space-141": "140px",
        "--space-142": "144px",
        "--space-143": "144px",
        "--space-144": "144px",
        "--space-145": "144px",
        "--space-146": "148px",
        "--space-147": "148px",
        "--space-148": "148px",
        "--space-149": "148px",
        "--space-150": "152px",
        "--space-151": "152px",
        "--space-152": "152px",
        "--space-153": "152px",
        "--space-154": "156px",
        "--space-155": "156px",
        "--space-156": "156px",
        "--space-157": "156px",
        "--space-158": "160px",
        "--space-159": "160px",
        "--space-160": "160px",
        "--space-161": "160px",
        "--space-162": "164px",
        "--space-163": "164px",
        "--space-164": "164px",
        "--space-165": "164px",
        "--space-166": "168px",
        "--space-167": "168px",
        "--space-168": "168px",
        "--space-169": "168px",
        "--space-170": "172px",
        "--space-171": "172px",
        "--space-172": "172px",
        "--space-173": "172px",
        "--space-174": "176px",
        "--space-175": "176px",
        "--space-176": "176px",
        "--space-177": "176px",
        "--space-178": "180px",
        "--space-179": "180px",
        "--space-180": "180px",
        "--space-181": "180px",
        "--space-182": "184px",
        "--space-183": "184px",
        "--space-184": "184px",
        "--space-185": "184px",
        "--space-186": "188px",
        "--space-187": "188px",
        "--space-188": "188px",
        "--space-189": "188px",
        "--space-190": "192px",
        "--space-191": "192px",
        "--space-192": "192px",
        "--space-193": "192px",
        "--space-194": "196px",
        "--space-195": "196px",
        "--space-196": "196px",
        "--space-197": "196px",
        "--space-198": "200px",
        "--space-199": "200px",
        "--space-200": "200px",
        "--space-201": "200px",
        "--space-202": "204px",
        "--space-203": "204px",
        "--space-204": "204px",
        "--space-205": "204px",
        "--space-206": "208px",
        "--space-207": "208px",
        "--space-208": "208px",
        "--space-209": "208px",
        "--space-210": "212px",
        "--space-211": "212px",
        "--space-212": "212px",
        "--space-213": "212px",
        "--space-214": "216px",
        "--space-215": "216px",
        "--space-216": "216px",
        "--space-217": "216px",
        "--space-218": "220px",
        "--space-219": "220px",
        "--space-220": "220px",
        "--space-221": "220px",
        "--space-222": "224px",
        "--space-223": "224px",
        "--space-224": "224px",
        "--space-225": "224px",
        "--space-226": "228px",
        "--space-227": "228px",
        "--space-228": "228px",
        "--space-229": "228px",
        "--space-230": "232px",
        "--space-231": "232px",
        "--space-232": "232px",
        "--space-233": "232px",
        "--space-234": "236px",
        "--space-235": "236px",
        "--space-236": "236px",
        "--space-237": "236px",
        "--space-238": "240px",
        "--space-239": "240px",
        "--space-240": "240px",
        "--space-241": "240px",
        "--space-242": "244px",
        "--space-243": "244px",
        "--space-244": "244px",
        "--space-245": "244px",
        "--space-246": "248px",
        "--space-247": "248px",
        "--space-248": "248px",
        "--space-249": "248px",
        "--space-250": "252px",
        "--space-251": "252px",
        "--space-252": "252px",
        "--space-253": "252px",
        "--space-254": "256px",
        "--space-255": "256px",
        "--space-256": "256px",
        "--space-label-gap": "var(--space-8)",
        "--space-helper-gap": "var(--space-4)",
        "--space-field-gap": "var(--space-16)",
        "--space-icon-gap": "var(--space-8)",
        "--space-panel-padding": "var(--space-24)",
        "--space-group-gap": "var(--space-32)",
        "--dimension-1": "1px",
        "--dimension-2": "2px",
        "--dimension-3": "3px",
        "--dimension-4": "4px",
        "--dimension-5": "5px",
        "--dimension-6": "6px",
        "--dimension-7": "7px",
        "--dimension-8": "8px",
        "--dimension-9": "9px",
        "--dimension-10": "10px",
        "--dimension-11": "11px",
        "--dimension-12": "12px",
        "--dimension-13": "13px",
        "--dimension-14": "14px",
        "--dimension-15": "15px",
        "--dimension-16": "16px",
        "--dimension-18": "18px",
        "--dimension-19": "19px",
        "--dimension-20": "20px",
        "--dimension-22": "22px",
        "--dimension-24": "24px",
        "--dimension-26": "26px",
        "--dimension-28": "28px",
        "--dimension-32": "32px",
        "--dimension-34": "34px",
        "--dimension-35": "35px",
        "--dimension-36": "36px",
        "--dimension-38": "38px",
        "--dimension-40": "40px",
        "--dimension-42": "42px",
        "--dimension-44": "44px",
        "--dimension-48": "48px",
        "--dimension-49": "49px",
        "--dimension-56": "56px",
        "--dimension-60": "60px",
        "--dimension-64": "64px",
        "--dimension-65": "65px",
        "--dimension-72": "72px",
        "--dimension-76": "76px",
        "--dimension-80": "80px",
        "--dimension-84": "84px",
        "--dimension-90": "90px",
        "--dimension-91": "91px",
        "--dimension-96": "96px",
        "--dimension-100": "100px",
        "--dimension-104": "104px",
        "--dimension-105": "105px",
        "--dimension-110": "110px",
        "--dimension-120": "120px",
        "--dimension-122": "122px",
        "--dimension-130": "130px",
        "--dimension-140": "140px",
        "--dimension-141": "141px",
        "--dimension-150": "150px",
        "--dimension-160": "160px",
        "--dimension-170": "170px",
        "--dimension-179": "179px",
        "--dimension-180": "180px",
        "--dimension-190": "190px",
        "--dimension-200": "200px",
        "--dimension-208": "208px",
        "--dimension-220": "220px",
        "--dimension-222": "222px",
        "--dimension-228": "228px",
        "--dimension-240": "240px",
        "--dimension-252": "252px",
        "--dimension-260": "260px",
        "--dimension-264": "264px",
        "--dimension-268": "268px",
        "--dimension-280": "280px",
        "--dimension-300": "300px",
        "--dimension-320": "320px",
        "--dimension-340": "340px",
        "--dimension-360": "360px",
        "--dimension-370": "370px",
        "--dimension-400": "400px",
        "--dimension-420": "420px",
        "--dimension-440": "440px",
        "--dimension-465": "465px",
        "--dimension-480": "480px",
        "--dimension-483": "483px",
        "--dimension-490": "490px",
        "--dimension-520": "520px",
        "--dimension-560": "560px",
        "--dimension-600": "600px",
        "--dimension-630": "630px",
        "--dimension-640": "640px",
        "--dimension-670": "670px",
        "--dimension-680": "680px",
        "--dimension-800": "800px",
        "--dimension-820": "820px",
        "--dimension-1352": "1352px",
        "--radius-4": "4px",
        "--radius-8": "8px",
        "--radius-20": "20px",
        "--radius-32": "32px",
        "--radius-40": "40px",
        "--radius-lg": "16px",
        "--border-style": "solid",
        "--border-sides": "all",
        "--border-state-focus": "var(--red-500)",
        "--focus-ring-width": "2px",
        "--size-control": "40px",
        "--size-target": "44px",
        "--size-icon": "24px",
        "--size-content": "1200px",
        "--size-sidebar": "264px",
        "--icon-size": "24px",
        "--icon-stroke": "1.8",
        "--icon-cap": "round",
        "--icon-join": "round",
        "--grid-columns": "12",
        "--grid-gutter": "24px"
      },
      "dataFormat": {
        "locale": "en-GB",
        "grouping": true,
        "separator": "locale",
        "unit": "kg",
        "unitSpace": "none",
        "currency": "GBP",
        "currencyDisplay": "symbol",
        "decimals": 2,
        "large": "compact",
        "tableAlign": "end",
        "date": "iso",
        "hourCycle": "h23",
        "seconds": false,
        "combined": "space",
        "relative": true,
        "zone": "UTC",
        "showZone": true,
        "range": " – ",
        "noValue": "–",
        "loading": "skeleton",
        "redaction": "partial",
        "mask": "*",
        "reveal": 4,
        "escapedSpace": "space"
      },
      "gridSystem": "columns",
      "iconStyle": "duotone"
    },
    "dark": {
      "version": 1,
      "unit": "px",
      "theme": "dark",
      "tokens": {
        "--graphite-950": "#0d0f11",
        "--graphite-900": "#15171a",
        "--graphite-850": "#191c20",
        "--graphite-800": "#1c1f23",
        "--graphite-700": "#262a2f",
        "--graphite-600": "#383d44",
        "--graphite-500": "#565c64",
        "--control-border": "#72767e",
        "--line": "rgba(255,255,255,0.08)",
        "--line-strong": "rgba(255,255,255,0.16)",
        "--border-width-0": "0px",
        "--border-width-1": "1px",
        "--border-width-1-5": "1.5px",
        "--border-width-2": "2px",
        "--border-width-3": "3px",
        "--border-width-4": "4px",
        "--text-hi": "var(--type-h6-color)",
        "--text-mid": "var(--type-body-color)",
        "--text-dim": "var(--type-caption-color)",
        "--overlay-invert-bg": "#f3f2ef",
        "--overlay-invert-text": "#15171a",
        "--overlay-invert-amber": "#8f6624",
        "--opacity-40": "0.4",
        "--opacity-50": "0.5",
        "--color-focus-ring": "var(--border-state-focus)",
        "--color-on-brand": "var(--on-brand-text)",
        "--on-brand-text": "#FFFFFF",
        "--red-500": "#FF031A",
        "--red-400": "#ff4253",
        "--red-600": "#d10215",
        "--red-glow": "rgba(255,3,26,0.35)",
        "--red-tint": "rgba(255,3,26,0.08)",
        "--brand-500": "var(--red-500)",
        "--brand-400": "var(--red-400)",
        "--brand-600": "var(--red-600)",
        "--brand-glow": "var(--red-glow)",
        "--brand-tint": "var(--red-tint)",
        "--surface-page": "var(--graphite-950)",
        "--surface-panel": "var(--graphite-900)",
        "--surface-raised": "var(--graphite-850)",
        "--green-500": "#2fbf6e",
        "--amber-500": "#e6a53a",
        "--danger-500": "#ff031a",
        "--danger-400": "#ff4253",
        "--danger-600": "#d10215",
        "--blue-500": "#4f8fe6",
        "--tracking-tight": "-0.01em",
        "--tracking-2": "0.02em",
        "--tracking-3": "0.03em",
        "--tracking-4": "0.04em",
        "--tracking-5": "0.05em",
        "--tracking-6": "0.06em",
        "--tracking-8": "0.08em",
        "--tracking-10": "0.1em",
        "--tracking-12": "0.12em",
        "--tracking-14": "0.14em",
        "--font-display": "\"Inter\", ui-sans-serif, system-ui, sans-serif",
        "--font-body": "\"Inter\", ui-sans-serif, system-ui, sans-serif",
        "--font-mono": "\"JetBrains Mono\", ui-monospace, \"SFMono-Regular\", monospace",
        "--numeric-tabular": "tabular-nums",
        "--radius-none": "0px",
        "--radius-2": "2px",
        "--radius-sm": "4px",
        "--radius-6": "6px",
        "--radius-md": "8px",
        "--radius-12": "12px",
        "--radius-16": "16px",
        "--radius-24": "24px",
        "--radius-full": "9999px",
        "--space-4": "4px",
        "--space-8": "8px",
        "--space-12": "12px",
        "--space-16": "16px",
        "--space-20": "20px",
        "--space-24": "24px",
        "--space-28": "28px",
        "--space-32": "32px",
        "--space-40": "40px",
        "--space-48": "48px",
        "--space-56": "56px",
        "--space-64": "64px",
        "--space-72": "72px",
        "--space-80": "80px",
        "--space-96": "96px",
        "--space-112": "112px",
        "--space-128": "128px",
        "--shadow-none": "none",
        "--shadow-xs": "0 1px 2px rgba(0,0,0,0.06)",
        "--shadow-sm": "0 1px 4px rgba(0,0,0,0.08)",
        "--shadow-md": "0 4px 8px rgba(0,0,0,0.1)",
        "--shadow-lg": "0 8px 16px rgba(0,0,0,0.12)",
        "--shadow-xl": "0 12px 24px rgba(0,0,0,0.14)",
        "--shadow-2xl": "0 16px 32px rgba(0,0,0,0.16)",
        "--overlay-scrim": "rgba(0,0,0,0.55)",
        "--duration-fast": "0.12s",
        "--duration-base": "0.15s",
        "--duration-slow": "0.8s",
        "--duration-shimmer": "1.5s",
        "--ease-standard": "ease",
        "--ease-emphasis": "ease-in-out",
        "--ease-linear": "linear",
        "--button-primary-bg-default": "var(--red-500)",
        "--button-primary-bg-hover": "var(--red-400)",
        "--button-primary-bg-active": "var(--red-600)",
        "--button-primary-text": "var(--color-on-brand)",
        "--button-primary-text-default": "#FFFFFF",
        "--button-primary-text-hover": "#FFFFFF",
        "--button-primary-text-active": "#FFFFFF",
        "--button-primary-focus-ring": "var(--color-focus-ring)",
        "--button-primary-disabled-opacity": "0.45",
        "--table-cell-padding-y-default": "var(--space-8)",
        "--table-cell-padding-y-compact": "var(--space-4)",
        "--table-header-text": "var(--text-dim)",
        "--table-border-color": "var(--line)",
        "--modal-scrim": "var(--overlay-scrim)",
        "--modal-surface": "var(--graphite-900)",
        "--modal-shadow": "var(--shadow-xl)",
        "--modal-border-color": "var(--line-strong)",
        "--card-surface": "var(--graphite-900)",
        "--card-border-color": "var(--line-strong)",
        "--card-shadow-rest": "var(--shadow-sm)",
        "--card-shadow-hover": "var(--shadow-md)",
        "--card-shadow-pressed": "var(--shadow-xs)",
        "--status-success-text": "#000000",
        "--status-warning-text": "#000000",
        "--status-danger-text": "#000000",
        "--status-info-text": "#000000",
        "--link-text": "#ff263a",
        "--color-ai-accent": "#8b5cf6",
        "--color-ai-accent-strong": "#a78bfa",
        "--color-ai-accent-tint": "rgba(139,92,246,0.12)",
        "--color-ai-confidence-high": "var(--green-700)",
        "--color-ai-confidence-medium": "#e6a53a",
        "--color-ai-confidence-low": "var(--danger-700)",
        "--color-agent-success": "var(--green-500)",
        "--color-agent-failure": "var(--danger-500)",
        "--type-h1-family": "var(--font-display)",
        "--type-h1-size": "32px",
        "--type-h1-line-height": "1.25",
        "--type-h1-weight": "700",
        "--type-h1-style": "normal",
        "--type-h1-tracking": "0px",
        "--type-h1-color": "#D8DFEE",
        "--type-h2-family": "var(--font-display)",
        "--type-h2-size": "28px",
        "--type-h2-line-height": "1.29",
        "--type-h2-weight": "700",
        "--type-h2-style": "normal",
        "--type-h2-tracking": "0px",
        "--type-h2-color": "#D8DFEE",
        "--type-h3-family": "var(--font-display)",
        "--type-h3-size": "24px",
        "--type-h3-line-height": "1.33",
        "--type-h3-weight": "600",
        "--type-h3-style": "normal",
        "--type-h3-tracking": "0px",
        "--type-h3-color": "#D8DFEE",
        "--type-h4-family": "var(--font-display)",
        "--type-h4-size": "20px",
        "--type-h4-line-height": "1.4",
        "--type-h4-weight": "600",
        "--type-h4-style": "normal",
        "--type-h4-tracking": "0px",
        "--type-h4-color": "#D8DFEE",
        "--type-h5-family": "var(--font-display)",
        "--type-h5-size": "18px",
        "--type-h5-line-height": "1.44",
        "--type-h5-weight": "500",
        "--type-h5-style": "normal",
        "--type-h5-tracking": "0px",
        "--type-h5-color": "#D8DFEE",
        "--type-h6-family": "var(--font-display)",
        "--type-h6-size": "16px",
        "--type-h6-line-height": "1.5",
        "--type-h6-weight": "500",
        "--type-h6-style": "normal",
        "--type-h6-tracking": "0px",
        "--type-h6-color": "#D8DFEE",
        "--type-body-family": "var(--font-body)",
        "--type-body-size": "16px",
        "--type-body-line-height": "1.5",
        "--type-body-weight": "400",
        "--type-body-style": "normal",
        "--type-body-tracking": "0px",
        "--type-body-color": "#9CA6B4",
        "--type-paragraph-family": "var(--font-body)",
        "--type-paragraph-size": "16px",
        "--type-paragraph-line-height": "1.5",
        "--type-paragraph-weight": "400",
        "--type-paragraph-style": "normal",
        "--type-paragraph-tracking": "0px",
        "--type-paragraph-color": "#9CA6B4",
        "--type-caption-family": "var(--font-body)",
        "--type-caption-size": "11px",
        "--type-caption-line-height": "1.5",
        "--type-caption-weight": "400",
        "--type-caption-style": "normal",
        "--type-caption-tracking": "0px",
        "--type-caption-color": "#7F8694",
        "--type-active-family": "var(--font-body)",
        "--type-active-size": "14px",
        "--type-active-line-height": "1.43",
        "--type-active-weight": "500",
        "--type-active-style": "normal",
        "--type-active-tracking": "0px",
        "--type-active-color": "#F74858",
        "--type-selected-family": "var(--font-body)",
        "--type-selected-size": "14px",
        "--type-selected-line-height": "1.43",
        "--type-selected-weight": "600",
        "--type-selected-style": "normal",
        "--type-selected-tracking": "0px",
        "--type-selected-color": "#F74858",
        "--type-disabled-family": "var(--font-body)",
        "--type-disabled-size": "14px",
        "--type-disabled-line-height": "1.43",
        "--type-disabled-weight": "400",
        "--type-disabled-style": "normal",
        "--type-disabled-tracking": "0px",
        "--type-disabled-color": "#505763",
        "--type-error-family": "var(--font-body)",
        "--type-error-size": "14px",
        "--type-error-line-height": "1.43",
        "--type-error-weight": "500",
        "--type-error-style": "normal",
        "--type-error-tracking": "0px",
        "--type-error-color": "#FA818B",
        "--type-warning-family": "var(--font-body)",
        "--type-warning-size": "14px",
        "--type-warning-line-height": "1.43",
        "--type-warning-weight": "500",
        "--type-warning-style": "normal",
        "--type-warning-tracking": "0px",
        "--type-warning-color": "#E6BC77",
        "--type-success-family": "var(--font-body)",
        "--type-success-size": "14px",
        "--type-success-line-height": "1.43",
        "--type-success-weight": "500",
        "--type-success-style": "normal",
        "--type-success-tracking": "0px",
        "--type-success-color": "#5ECD8F",
        "--type-info-family": "var(--font-body)",
        "--type-info-size": "14px",
        "--type-info-line-height": "1.43",
        "--type-info-weight": "500",
        "--type-info-style": "normal",
        "--type-info-tracking": "0px",
        "--type-info-color": "#8AB2E8",
        "--green-700": "#2fbf6e",
        "--danger-700": "#ff031a",
        "--red-700": "#ff031a",
        "--green-page-text": "#2fbf6e",
        "--danger-page-text": "#ff031a",
        "--amber-page-text": "#e6a53a",
        "--blue-page-text": "#4f8fe6",
        "--contrast-pass-bg": "#182b24",
        "--contrast-pass-text": "#2fbf6e",
        "--contrast-fail-bg": "#31151a",
        "--contrast-fail-text": "#ff2b3f",
        "--agent-approve-bg-default": "#1a392b",
        "--agent-approve-text-default": "#2fbf6e",
        "--agent-approve-bg-hover": "#1c4632",
        "--agent-approve-text-hover": "#33c071",
        "--agent-approve-bg-active": "#1e5338",
        "--agent-approve-text-active": "#5dcd8e",
        "--agent-reject-bg-default": "#303439",
        "--agent-reject-text-default": "#9ca6b4",
        "--agent-reject-bg-hover": "#3b3f45",
        "--agent-reject-text-hover": "#a0aab7",
        "--agent-reject-bg-active": "#464a51",
        "--agent-reject-text-active": "#b2bac5",
        "--color-brand": "var(--red-500)",
        "--color-action-default": "var(--red-500)",
        "--color-action-hover": "var(--red-400)",
        "--color-action-active": "var(--red-600)",
        "--color-text-primary": "var(--type-body-color)",
        "--color-text-caption": "var(--type-caption-color)",
        "--color-surface-page": "var(--graphite-950)",
        "--color-surface-panel": "var(--graphite-900)",
        "--color-surface-raised": "var(--graphite-850)",
        "--layer-content": "0",
        "--layer-sticky": "20",
        "--layer-popover": "40",
        "--layer-scrim": "60",
        "--layer-dialog": "70",
        "--layer-toast": "80",
        "--layer-tooltip": "90",
        "--space-1": "1px",
        "--space-2": "2px",
        "--space-3": "3px",
        "--space-5": "4px",
        "--space-6": "8px",
        "--space-7": "8px",
        "--space-9": "8px",
        "--space-10": "12px",
        "--space-11": "12px",
        "--space-13": "12px",
        "--space-14": "16px",
        "--space-15": "16px",
        "--space-17": "16px",
        "--space-18": "20px",
        "--space-19": "20px",
        "--space-21": "20px",
        "--space-22": "24px",
        "--space-23": "24px",
        "--space-25": "24px",
        "--space-26": "28px",
        "--space-27": "28px",
        "--space-29": "28px",
        "--space-30": "32px",
        "--space-31": "32px",
        "--space-33": "32px",
        "--space-34": "36px",
        "--space-35": "36px",
        "--space-36": "36px",
        "--space-37": "36px",
        "--space-38": "40px",
        "--space-39": "40px",
        "--space-41": "40px",
        "--space-42": "44px",
        "--space-43": "44px",
        "--space-44": "44px",
        "--space-45": "44px",
        "--space-46": "48px",
        "--space-47": "48px",
        "--space-49": "48px",
        "--space-50": "52px",
        "--space-51": "52px",
        "--space-52": "52px",
        "--space-53": "52px",
        "--space-54": "56px",
        "--space-55": "56px",
        "--space-57": "56px",
        "--space-58": "60px",
        "--space-59": "60px",
        "--space-60": "60px",
        "--space-61": "60px",
        "--space-62": "64px",
        "--space-63": "64px",
        "--space-65": "64px",
        "--space-66": "68px",
        "--space-67": "68px",
        "--space-68": "68px",
        "--space-69": "68px",
        "--space-70": "72px",
        "--space-71": "72px",
        "--space-73": "72px",
        "--space-74": "76px",
        "--space-75": "76px",
        "--space-76": "76px",
        "--space-77": "76px",
        "--space-78": "80px",
        "--space-79": "80px",
        "--space-81": "80px",
        "--space-82": "84px",
        "--space-83": "84px",
        "--space-84": "84px",
        "--space-85": "84px",
        "--space-86": "88px",
        "--space-87": "88px",
        "--space-88": "88px",
        "--space-89": "88px",
        "--space-90": "92px",
        "--space-91": "92px",
        "--space-92": "92px",
        "--space-93": "92px",
        "--space-94": "96px",
        "--space-95": "96px",
        "--space-97": "96px",
        "--space-98": "100px",
        "--space-99": "100px",
        "--space-100": "100px",
        "--space-101": "100px",
        "--space-102": "104px",
        "--space-103": "104px",
        "--space-104": "104px",
        "--space-105": "104px",
        "--space-106": "108px",
        "--space-107": "108px",
        "--space-108": "108px",
        "--space-109": "108px",
        "--space-110": "112px",
        "--space-111": "112px",
        "--space-113": "112px",
        "--space-114": "116px",
        "--space-115": "116px",
        "--space-116": "116px",
        "--space-117": "116px",
        "--space-118": "120px",
        "--space-119": "120px",
        "--space-120": "120px",
        "--space-121": "120px",
        "--space-122": "124px",
        "--space-123": "124px",
        "--space-124": "124px",
        "--space-125": "124px",
        "--space-126": "128px",
        "--space-127": "128px",
        "--space-129": "128px",
        "--space-130": "132px",
        "--space-131": "132px",
        "--space-132": "132px",
        "--space-133": "132px",
        "--space-134": "136px",
        "--space-135": "136px",
        "--space-136": "136px",
        "--space-137": "136px",
        "--space-138": "140px",
        "--space-139": "140px",
        "--space-140": "140px",
        "--space-141": "140px",
        "--space-142": "144px",
        "--space-143": "144px",
        "--space-144": "144px",
        "--space-145": "144px",
        "--space-146": "148px",
        "--space-147": "148px",
        "--space-148": "148px",
        "--space-149": "148px",
        "--space-150": "152px",
        "--space-151": "152px",
        "--space-152": "152px",
        "--space-153": "152px",
        "--space-154": "156px",
        "--space-155": "156px",
        "--space-156": "156px",
        "--space-157": "156px",
        "--space-158": "160px",
        "--space-159": "160px",
        "--space-160": "160px",
        "--space-161": "160px",
        "--space-162": "164px",
        "--space-163": "164px",
        "--space-164": "164px",
        "--space-165": "164px",
        "--space-166": "168px",
        "--space-167": "168px",
        "--space-168": "168px",
        "--space-169": "168px",
        "--space-170": "172px",
        "--space-171": "172px",
        "--space-172": "172px",
        "--space-173": "172px",
        "--space-174": "176px",
        "--space-175": "176px",
        "--space-176": "176px",
        "--space-177": "176px",
        "--space-178": "180px",
        "--space-179": "180px",
        "--space-180": "180px",
        "--space-181": "180px",
        "--space-182": "184px",
        "--space-183": "184px",
        "--space-184": "184px",
        "--space-185": "184px",
        "--space-186": "188px",
        "--space-187": "188px",
        "--space-188": "188px",
        "--space-189": "188px",
        "--space-190": "192px",
        "--space-191": "192px",
        "--space-192": "192px",
        "--space-193": "192px",
        "--space-194": "196px",
        "--space-195": "196px",
        "--space-196": "196px",
        "--space-197": "196px",
        "--space-198": "200px",
        "--space-199": "200px",
        "--space-200": "200px",
        "--space-201": "200px",
        "--space-202": "204px",
        "--space-203": "204px",
        "--space-204": "204px",
        "--space-205": "204px",
        "--space-206": "208px",
        "--space-207": "208px",
        "--space-208": "208px",
        "--space-209": "208px",
        "--space-210": "212px",
        "--space-211": "212px",
        "--space-212": "212px",
        "--space-213": "212px",
        "--space-214": "216px",
        "--space-215": "216px",
        "--space-216": "216px",
        "--space-217": "216px",
        "--space-218": "220px",
        "--space-219": "220px",
        "--space-220": "220px",
        "--space-221": "220px",
        "--space-222": "224px",
        "--space-223": "224px",
        "--space-224": "224px",
        "--space-225": "224px",
        "--space-226": "228px",
        "--space-227": "228px",
        "--space-228": "228px",
        "--space-229": "228px",
        "--space-230": "232px",
        "--space-231": "232px",
        "--space-232": "232px",
        "--space-233": "232px",
        "--space-234": "236px",
        "--space-235": "236px",
        "--space-236": "236px",
        "--space-237": "236px",
        "--space-238": "240px",
        "--space-239": "240px",
        "--space-240": "240px",
        "--space-241": "240px",
        "--space-242": "244px",
        "--space-243": "244px",
        "--space-244": "244px",
        "--space-245": "244px",
        "--space-246": "248px",
        "--space-247": "248px",
        "--space-248": "248px",
        "--space-249": "248px",
        "--space-250": "252px",
        "--space-251": "252px",
        "--space-252": "252px",
        "--space-253": "252px",
        "--space-254": "256px",
        "--space-255": "256px",
        "--space-256": "256px",
        "--space-label-gap": "var(--space-8)",
        "--space-helper-gap": "var(--space-4)",
        "--space-field-gap": "var(--space-16)",
        "--space-icon-gap": "var(--space-8)",
        "--space-panel-padding": "var(--space-24)",
        "--space-group-gap": "var(--space-32)",
        "--dimension-1": "1px",
        "--dimension-2": "2px",
        "--dimension-3": "3px",
        "--dimension-4": "4px",
        "--dimension-5": "5px",
        "--dimension-6": "6px",
        "--dimension-7": "7px",
        "--dimension-8": "8px",
        "--dimension-9": "9px",
        "--dimension-10": "10px",
        "--dimension-11": "11px",
        "--dimension-12": "12px",
        "--dimension-13": "13px",
        "--dimension-14": "14px",
        "--dimension-15": "15px",
        "--dimension-16": "16px",
        "--dimension-18": "18px",
        "--dimension-19": "19px",
        "--dimension-20": "20px",
        "--dimension-22": "22px",
        "--dimension-24": "24px",
        "--dimension-26": "26px",
        "--dimension-28": "28px",
        "--dimension-32": "32px",
        "--dimension-34": "34px",
        "--dimension-35": "35px",
        "--dimension-36": "36px",
        "--dimension-38": "38px",
        "--dimension-40": "40px",
        "--dimension-42": "42px",
        "--dimension-44": "44px",
        "--dimension-48": "48px",
        "--dimension-49": "49px",
        "--dimension-56": "56px",
        "--dimension-60": "60px",
        "--dimension-64": "64px",
        "--dimension-65": "65px",
        "--dimension-72": "72px",
        "--dimension-76": "76px",
        "--dimension-80": "80px",
        "--dimension-84": "84px",
        "--dimension-90": "90px",
        "--dimension-91": "91px",
        "--dimension-96": "96px",
        "--dimension-100": "100px",
        "--dimension-104": "104px",
        "--dimension-105": "105px",
        "--dimension-110": "110px",
        "--dimension-120": "120px",
        "--dimension-122": "122px",
        "--dimension-130": "130px",
        "--dimension-140": "140px",
        "--dimension-141": "141px",
        "--dimension-150": "150px",
        "--dimension-160": "160px",
        "--dimension-170": "170px",
        "--dimension-179": "179px",
        "--dimension-180": "180px",
        "--dimension-190": "190px",
        "--dimension-200": "200px",
        "--dimension-208": "208px",
        "--dimension-220": "220px",
        "--dimension-222": "222px",
        "--dimension-228": "228px",
        "--dimension-240": "240px",
        "--dimension-252": "252px",
        "--dimension-260": "260px",
        "--dimension-264": "264px",
        "--dimension-268": "268px",
        "--dimension-280": "280px",
        "--dimension-300": "300px",
        "--dimension-320": "320px",
        "--dimension-340": "340px",
        "--dimension-360": "360px",
        "--dimension-370": "370px",
        "--dimension-400": "400px",
        "--dimension-420": "420px",
        "--dimension-440": "440px",
        "--dimension-465": "465px",
        "--dimension-480": "480px",
        "--dimension-483": "483px",
        "--dimension-490": "490px",
        "--dimension-520": "520px",
        "--dimension-560": "560px",
        "--dimension-600": "600px",
        "--dimension-630": "630px",
        "--dimension-640": "640px",
        "--dimension-670": "670px",
        "--dimension-680": "680px",
        "--dimension-800": "800px",
        "--dimension-820": "820px",
        "--dimension-1352": "1352px",
        "--radius-4": "4px",
        "--radius-8": "8px",
        "--radius-20": "20px",
        "--radius-32": "32px",
        "--radius-40": "40px",
        "--radius-lg": "16px",
        "--border-style": "solid",
        "--border-sides": "all",
        "--border-state-focus": "var(--red-400)",
        "--focus-ring-width": "2px",
        "--size-control": "40px",
        "--size-target": "44px",
        "--size-icon": "24px",
        "--size-content": "1200px",
        "--size-sidebar": "264px",
        "--icon-size": "24px",
        "--icon-stroke": "1.8",
        "--icon-cap": "round",
        "--icon-join": "round",
        "--grid-columns": "12",
        "--grid-gutter": "24px"
      },
      "dataFormat": {
        "locale": "en-GB",
        "grouping": true,
        "separator": "locale",
        "unit": "kg",
        "unitSpace": "none",
        "currency": "GBP",
        "currencyDisplay": "symbol",
        "decimals": 2,
        "large": "compact",
        "tableAlign": "end",
        "date": "iso",
        "hourCycle": "h23",
        "seconds": false,
        "combined": "space",
        "relative": true,
        "zone": "UTC",
        "showZone": true,
        "range": " – ",
        "noValue": "–",
        "loading": "skeleton",
        "redaction": "partial",
        "mask": "*",
        "reveal": 4,
        "escapedSpace": "space"
      },
      "gridSystem": "columns",
      "iconStyle": "duotone"
    }
  },
  "platformProfiles": {},
  "verification": {
    "unsavedPreviewKeys": []
  },
  "selection": {
    "savedSections": [
      "colors",
      "bg-colors",
      "status-colors",
      "neutral-colors",
      "grid-layout",
      "typography",
      "spacing",
      "radius",
      "border",
      "border-states",
      "shadow",
      "icons",
      "units",
      "sizing",
      "data-format"
    ],
    "unselectedSections": "Library defaults in resolved dependencies; saved customizations excluded."
  }
}
```

Provenance: `colors`, `bg-colors`, `status-colors`, `neutral-colors`, `grid-layout`, `typography`, `spacing`, `radius`, `border`, `border-states`, `shadow`, `icons`, `units`, `sizing`, `data-format` are this system's own documented default because a usable saved override was not found. Resolved dependencies also contain library defaults.

## Asset manifest

Uploaded files are preserved in Foundation JSON. This Markdown identifies dependencies without embedding large binary data. Icon references require review before inline reuse.

```json
{
  "schemaVersion": 1,
  "namedIcons": {
    "schemaVersion": 1,
    "source": "Google Material Icons, filled, 24px viewBox",
    "license": "Apache-2.0",
    "licenseFile": "Material-Icons-LICENSE.txt",
    "icons": {
      "edit": {
        "directional": false,
        "path": "M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm17.71-10.04a.996.996 0 000-1.41l-2.34-2.34a.996.996 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
      },
      "close": {
        "directional": false,
        "path": "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
      },
      "confirm": {
        "directional": false,
        "path": "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
      },
      "add": {
        "directional": false,
        "path": "M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z"
      },
      "info": {
        "directional": false,
        "path": "M11 17h2v-6h-2v6zm1-15C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM11 9h2V7h-2v2z"
      },
      "chevron-end": {
        "directional": true,
        "path": "M9.29 6.71a.996.996 0 000 1.41L13.17 12l-3.88 3.88a.996.996 0 101.41 1.41l4.59-4.59a.996.996 0 000-1.41L10.7 6.7a.996.996 0 00-1.41.01z"
      }
    }
  },
  "assets": []
}
```

## Validation & open decisions

- No project setup was saved for this export - every value above is this system's own plain documented default, not a decision made for this project.
- Rendered browser, font decoding, forced-color, zoom and assistive-technology acceptance require separate evidence; a valid saved record does not certify these checks.

---

## Accessibility

Source: accessibility.html · Status: Available

# Accessibility
  
What this system already does for you on every page, without being asked - and, just as importantly, what it doesn't do yet. WCAG 2.2 AA is the baseline referenced throughout.

## Automatic on every page
    
Injected sitewide by experience.js - a page doesn't opt in, and can't opt out.

        Skip to content

          A "Skip to content" link is prepended to every page, targeting a real, focusable <main> landmark
        
        2.4.1

        Heading structure

          Every visually-styled "panel title" is retrofitted into a real <h2>, not left as a plain, non-semantic paragraph
        
        1.3.1

        Page outline

          An "On this page" navigation landmark is auto-built from a page's real headings once there are more than two
        
        2.4.5

        Current page

          The active sidebar link carries aria-current="page" automatically
        
        4.1.2

        Icon-only buttons

          Any icon-only button's title attribute is copied to aria-label automatically, so it has a real accessible name
        
        4.1.2

        Clickable cards

          A card that navigates on click is a real <a> element, not a div with a click handler and no keyboard path
        
        2.1.1

        Horizontal scroll regions

          Any horizontally-scrolling comparison table is marked role="region" with a descriptive label
        
        1.3.1

## Focus
    
The shared --color-focus-ring token follows the configured focus state. Keyboard focus uses :focus-visible; selected examples can also demonstrate a fixed focus state. Some semantic action variants use their own status color. Verify each variant with a keyboard and in forced-colors mode.

## Motion
    
Every transition and animation sitewide resolves to one of six shared motion tokens (Motion isn't yet its own Foundation page, but the tokens exist in theme.css). Under prefers-reduced-motion, animation and transition durations sitewide collapse to near-zero - a user who has asked their OS to reduce motion gets that everywhere in this system, not page-by-page.

## Touch targets
    
Shared target sizing defaults to 44px and cannot be configured below 44px in the sizing editor. Explicit compact component examples retain their documented size variants. Check actual hit areas, spacing between adjacent targets and zoom behavior on each supported device; a configured token alone does not establish accessibility conformance.

## Color contrast
    
Colors shows live AA/AAA contrast checks for text pairs and a separate 3:1 non-text check for essential Control Border boundaries. Recheck each actual component surface, state and alpha blend; a token badge does not certify all uses. Picker simulations for protanopia, deuteranopia and tritanopia are simplified previews. Use labels, shapes and messages alongside color.

## Localization and preferences
    
Theme, density and direction (RTL) are each a real, live, sitewide toggle (Settings), persisted per browser and synced instantly across any other open tab of this system - not a per-page setting you'd have to repeat.

## Known gaps - not yet done
    
Said plainly, not glossed over:

        ARIA depth per component

          Table and Modal have rich, component-specific ARIA; simpler components mostly rely on shared shell chrome - not independently audited component-by-component
        
        Uneven

        200% zoom / reflow

          Not individually verified per component across the 63-component library
        
        Unverified

        Text spacing override (1.4.12)

          Not tested against a user style sheet that overrides line-height/letter-spacing/word-spacing
        
        Unverified

## Foundation editor state model

Draft: an unfinished value in an editor. Preview: a valid configuration rendered in the current page. Auto-save: valid edits written to local storage without waiting for Save. Apply: the shared Foundation resolver updates the current page and marked examples from valid settings. Export: Markdown and JSON include the currently applied settings. If storage fails, a visible warning identifies the unsaved preview; reload restores the last durable save.

        Radius and Typography

          Valid font, type-role and radius edits auto-save and apply through the shared Foundation resolver. Save confirms persistence; reload restores the saved settings. Typography reset cancels pending font uploads before restoring defaults.
        
        Auto-save + auto-apply

        Colors (Brand, Surface, Status, Neutral)

          Valid brand, surface, status and neutral edits auto-save and apply immediately. Incomplete hex values keep the previous valid configuration. The local Save action confirms the current configuration; it is not required to propagate valid edits.
        
        Auto-save + auto-apply

        Spacing, Grid & Layout, Borders, Shadows, Icons, Typography (per-level size/weight/line-height/italic/color)

          Valid dimension, border, shadow, grid and icon settings auto-save and apply through foundation-runtime.js. Marked component examples inherit shared metrics. Markdown includes the selected recipe and current resolved tokens, with equivalent px/rem dimensions. Icon uploads are reference assets, not a replacement for every component icon.
        
        Auto-save + auto-apply

Text-color ownership: --text-hi, --text-mid and --text-dim resolve through the H6, Body and Caption color roles. Typography role colors also apply directly through --type-*-color to headings, paragraphs and validation text. Changing a role can therefore update both its text and the semantic aliases that refer to it.
    
Rollback: editor Reset actions remove that section's saved configuration and restore defaults. Grid, Spacing and Radius can restore project-context recommendations. AI approval Undo only reverses its demonstration; it does not reset Foundation settings.
    
Storage recovery: editor persistence uses window.ADSStorage. Invalid values remain drafts; failed writes retain the previous durable save; failed resets leave it intact. Copy failures provide a manual-copy instruction rather than reporting success.

        Write fails (quota exceeded, storage unavailable)

          The error is caught instead of thrown uncaught mid-click - your on-screen selection can still change, but a visible banner says the change may not have persisted, and the field's previous saved value (if any) is left exactly as it was, since a failed write never reaches localStorage at all.
        
        Caught, reported, old value kept

        Read fails or the record is corrupt JSON

          Falls back to this section's own documented default - same as "nothing was ever saved" - but now says so with a visible banner, instead of silently defaulting with no sign your prior save was lost.
        
        Falls back, reported

        Record from a future/unrecognized schema

          All Foundation records use schemaVersion 1. Valid unversioned records migrate in memory and are stamped on the next successful edit. Future, malformed and invalid records are preserved and cannot be overwritten by ordinary saves. Back up raw saved settings, then use explicit section reset to recover. Typography also has a one-time heading-scale migration.
        
        Versioned, preserved

Selection semantics: a product/system "card" is a native <button> - its is-active class is what you see, but until now nothing told assistive technology which one was actually chosen. Every product-card-grid/system-card-grid is now a labelled toggle group (role="group" with an aria-label naming the choice, e.g. "Spacing system" or "What are you building?"), and every card's aria-pressed is kept in sync with is-active on every selection, reset, and page load - never just one or the other. Where picking a card also surfaces a recommendation (Spacing/Radius/Grid & Layout's "Recommended" callout), that callout is now role="status" aria-live="polite", so the outcome is announced the moment it appears, not only discoverable by navigating to it afterward. Verified via DOM assertions (exactly one aria-pressed="true" per group at all times, correct role/label/live-region attributes) rather than a physical screen reader - a real AT pass (VoiceOver/NVDA) remains a legitimate, separate follow-up.

## Foundation release contract

        Human View
        Machine View

The checks above are shared across every Foundation. This is the section-specific half: what counts as a compatible vs. breaking change to that section's own tokens, how a removed/renamed value gets deprecated instead of silently breaking saved projects, and what evidence closes a change as release-ready. One team (Design System Team) owns all nine sections today - a legitimate choice at this system's current size, not a gap - so "owner" isn't repeated per row below.

        Colors

          Additive: a new semantic alias. Breaking: a renamed/removed CSS custom property - deprecate by keeping the old variable as an alias for one release instead, noted in CHANGELOG.md. Release-ready when: contrast badges recompute correctly, Dark Mode sync holds across all 4 sections, and the full-site regression sweep is clean.
        
        Alias, don't remove

        Grid & Layout

          Additive: a new product card or layout pattern. Breaking: a changed data-product slug or grid-type key - deprecate by keeping the old slug as an entry in PROJECT_PRODUCT_TYPE_MAP rather than deleting it outright. Release-ready when: the Project setup to Spacing/Radius/Grid & Layout sync matrix passes for every category and the regression sweep is clean.
        
        Keep slug mapped

        Typography

          Additive: a new semantic level or platform preset. Breaking: a renamed font-size/weight token - deprecate by migrating a saved profile's per-level state on read, the same pattern project-model.js already uses for product-type migration. Release-ready when: a profile saved under the prior shape still loads and renders without error.
        
        Migrate on read

        Spacing

          Additive: a new product card. Breaking: a renamed system key (2px/4px/8px/Adaptive) or data-product slug - deprecate by aliasing the old slug/key rather than removing it. Release-ready when: the same 3-page product/platform sync matrix as Grid & Layout passes.
        
        Alias, don't remove

        Radius

          Additive: a new philosophy. Breaking: a numeric token's meaning changing without its name changing - deprecate by renaming rather than reassigning a numeric token's value, since a token name must keep meaning the same thing. Release-ready when: a section's Machine View value matches the live computed CSS custom property it claims to represent.
        
        Rename, don't reassign

        Borders

          Additive: a new preset. Breaking: a state's property becoming fixed after being advertised as editable - deprecate an editable property by relabeling it fixed in the same release the UI control is removed, not after. Release-ready when: every input the Config panel exposes actually changes what Save persists.
        
        Relabel same release

        Shadows

          Additive: a new elevation layer. Breaking: a philosophy's resolved recipe changing without its name changing - deprecate a philosophy by keeping its name mapped to a new recipe only with a CHANGELOG note, never silently. Release-ready when: a Machine View's resolved value matches the live rendered box-shadow.
        
        Note recipe changes

        Icons

          Additive: a new library. Breaking: an uploaded/custom icon reference no longer resolving - deprecate a library by keeping its id resolvable even once no longer offered as a default choice. Release-ready when: uploaded references survive reload, removal and reset, including blocked storage and interrupted file reads.
        
        Keep id resolvable

        AI & Agents

          Additive: a new rule or example. Breaking: a demo's cited evidence no longer matching its named source - deprecate an example by removing it in the same release its citation stops matching, not leaving a stale one live. Release-ready when: every citation in this section has been re-checked against the real file/line it names.
        
        Re-check citations

{}

## Accessibility - Markdown export
    
This page's own content, as Markdown - copy it straight into your design system docs or hand it to an AI/agent workflow.

      Copy Markdown

## Implementation contract

Saved validated choices override project recommendations, which override system defaults. This implementation contract governs static specimens. Resolved tokens in the current export are authoritative values. Component exceptions must name the affected role and reason.

### Acceptance
Verify keyboard, names/roles/values, visible focus, focus return, error association, status announcements and reading order. Test 200% zoom, text-spacing overrides, narrow reflow, RTL, reduced motion, forced colors and touch targets. WCAG AA checks are per actual usage, not a single token badge.

### Layout and state
Use the shared three-column responsive reference layout, 16px row gaps, 24px panel padding and 16px mobile padding. Valid choices auto-save/apply; unfinished drafts stay unapplied. Versioned recovery preserves unreadable records and offers backup/reset. Defaults are not proof of acceptance.

### Evidence
Report automated model/DOM checks separately from rendered-browser, real font and screen-reader checks. Record page, viewport, theme, state, method, outcome and artifact. Do not mark an unavailable check complete.
Machine contract: section rules, storage, units and acceptance
{
  "schemaVersion": 1,
  "authority": "Saved validated choices override project recommendations, which override system defaults. This implementation contract governs static specimens. Resolved tokens in the current export are authoritative values. Component exceptions must name the affected role and reason.",
  "governance": {
    "owners": "Design System Lead owns token and compatibility policy. Designers own specimens and interaction contracts. Developers own resolver/export/import parity. QA and Accessibility own release evidence. Product teams own domain-specific confidence, privacy and retention policies.",
    "changes": "Change the JSON contract first, regenerate documentation/defaults/catalog/tokens, then run model, DOM and recipient checks. Link the changed finding IDs and evidence in the release review.",
    "compatibility": "Keep hue-named CSS tokens as compatibility aliases while semantic consumers migrate. Additive tokens retain schemaVersion 1. A removed/renamed key or changed stored meaning requires a schema migration, a version bump and a documented replacement before release. Keep the prior reader fixture until the migration is verified.",
    "deprecation": "Record old key, replacement, reason, introduced version, planned removal version and affected consumers. Do not remove a token while an active consumer still uses it. Future records are preserved rather than coerced.",
    "scope": "This is a web design system with one shared workspace profile. Native dp/sp adaptation and real agent execution require separate adapters and acceptance. User-defined colors and responsive exceptions require product-specific rendered verification."
  },
  "storage": {
    "version": 1,
    "legacy": "Unversioned valid records migrate in memory. Typography headingScaleVersion 2 applies the smaller six-heading scale once to older records, retaining other roles and existing font/color/style metrics. Later custom size edits are retained. Unsupported future records are preserved. The next successful write stamps the migrated version.",
    "future": "Reject unsupported future versions. Preserve raw data. Offer backup and explicit reset.",
    "invalid": "Foundation selections preview locally until Save foundation succeeds. Saved Foundation editors require Edit foundation before changes. Cancel discards the preview. Invalid drafts never replace saved records; storage failures retain the editable preview and the last durable record.",
    "concurrency": "A storage event refreshes applied tokens and disables stale editor controls until reload. Never merge simultaneous edits silently."
  },
  "units": {
    "base": "1rem = 16px at default browser settings. Do not fix the root font size.",
    "use": "Prefer rem for typography, spacing and control dimensions. Hairline borders and viewport thresholds may use px. Both equivalents appear in Markdown. SVG strokes use viewBox units. Ratios, percentages, columns, timing and weights are unitless or retain their own units.",
    "native": "Web CSS px/rem are not native dp/sp. A native adapter must map semantic roles, support text scaling and test device density. Native rendering is not shipped by this web library."
  },
  "acceptance": [
    "Compare page, applied tokens, durable record, Machine View and exported instructions.",
    "Test valid, unfinished, invalid, missing, malformed, legacy and future records. Exercise storage failure, reset, reload and another tab.",
    "Test 320, 375, 768, 1024 and 1440px widths, 200% zoom, text-spacing overrides, RTL and long/localized labels.",
    "Use keyboard and screen reader. Confirm focus return, names, values, error associations and status announcements.",
    "Verify actual rendered text/surface pairs, forced colors, reduced motion, print and exported recipes in a recipient fixture. Source or DOM checks alone are not rendered acceptance."
  ],
  "layers": {
    "content": 0,
    "sticky": 20,
    "popover": 40,
    "scrim": 60,
    "dialog": 70,
    "toast": 80,
    "tooltip": 90,
    "rules": "Each overlay gets an explicit owner and close/focus-return path. Portal menus out of clipped scroll containers. Nested dialogs stack one scrim per modal owner. Escape closes the top dismissible layer. Tooltips never block actions. Test collision and zoom; do not infer stacking order from shadow size."
  },
  "section": {
    "title": "Accessibility",
    "rules": {
      "Acceptance": "Verify keyboard, names/roles/values, visible focus, focus return, error association, status announcements and reading order. Test 200% zoom, text-spacing overrides, narrow reflow, RTL, reduced motion, forced colors and touch targets. WCAG AA checks are per actual usage, not a single token badge.",
      "Layout and state": "Use the shared three-column responsive reference layout, 16px row gaps, 24px panel padding and 16px mobile padding. Valid choices auto-save/apply; unfinished drafts stay unapplied. Versioned recovery preserves unreadable records and offers backup/reset. Defaults are not proof of acceptance.",
      "Evidence": "Report automated model/DOM checks separately from rendered-browser, real font and screen-reader checks. Record page, viewport, theme, state, method, outcome and artifact. Do not mark an unavailable check complete."
    }
  }
}

---

## Add-on

Source: add-on-default.html · Status: Available

Components · Forms · Add-on
  Back to Add-on types

# Add-on
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
Use for a single-line text field that needs a fixed prefix and/or suffix segment attached to it, like a protocol prefix on a URL or a currency symbol on a price.

## Properties

Size, corner radius, label, placeholder, prefix and suffix are properties of the same component, not separate fields - change them below to check this field's style and states in the Live Preview.

        Size

        Corner radius

        Label

        Placeholder

        Show prefix

          segment on the left

        Prefix text

        Show suffix

          segment on the right

        Suffix text

        Allow clear

          × button once filled

        Suffix dropdown

          interactive, with a chevron

        Required

          shows a required indicator

        Supporting text

          shown below the field

        Supporting text

        Error message

## Live Preview
    
All 3 types compared side by side, each in all 8 states. One full matrix is rendered per selected combination of Size and Corner radius - check more than one option in a dropdown to see every combination side by side.

## When to use
    
Any single-line text field whose value is naturally paired with a fixed prefix or suffix, so the field alone would be ambiguous or need repeated typing.

      Website URL
      Price
      Username handle
      Weight/unit
      Email domain

## Validation
    
The prefix and suffix segments are static and never part of what gets validated - validation applies only to the core input value, and the add-on itself visually anchors the format that value is expected to match.

- Required marking - mark the field as a whole required, next to its label, the same as any text field - the add-on segment doesn't change how required state is shown.
      
- Format validation - check the typed value against the format the add-on implies, not a generic pattern - a username field with an "@company.com" suffix should validate the local-part on blur, since the add-on already fixes the rest of the format.
      
- Error message - reference the add-on's format directly, e.g. "Enter a username before @company.com," rather than a generic "Invalid input" that leaves the user guessing what "before @company.com" even means.
      
- Recovery - keep the add-on visible and unchanged while the core value is in an error state, so the expected format stays in view as the user corrects the input.

## Component Guide

        Human View
        Machine View

Overview
      
Add-on is a single-line text field with a fixed, non-editable prefix and/or suffix segment attached directly to it - used when the value alone would be ambiguous or would force the user to retype a constant part of it every time.

When to Use

- A value with a fixed protocol or domain prefix - https:// before a URL.
        
- A currency symbol on a price - $ before a numeric amount.
        
- A username handle with a fixed platform prefix - @ before a handle, or a fixed email domain suffix.

When Not to Use

- A value with no natural constant part - use a plain Input - adding an empty or irrelevant add-on segment is just visual noise.
        
- A prefix/suffix that the user should be able to edit or choose - use a Select alongside the field, or a Group Button, instead of a fixed, non-editable add-on.
        
- Multiple independent constant parts on both sides that combine in complex ways - consider breaking the field into clearly labeled separate inputs instead.

Best Practices

- Keep the add-on segment visually distinct but clearly non-editable (different background, no cursor) so users don't try to click into it.
        
- Use the add-on only for a genuinely constant part of the value - never for something that varies per use case.
        
- Make sure the combined value (prefix + typed value + suffix) is what actually gets submitted, not just displayed.

Do and Don't

Do

Price
£per month
          
The add-ons carry the unit, so the input holds only the number the user actually has to type.

Don't

Price
Set the amount
          
An add-on used as a label steals the width the value needs and leaves the field itself unlabelled. Add-ons are for units and fixed fragments, not instructions.

Accessibility

- The prefix/suffix text is exposed to assistive technology alongside the field's label, so its meaning isn't lost for screen-reader users.
        
- The editable portion remains a real, independently focusable input - the add-on segments are not part of the tab order since they aren't interactive.
        
- Sufficient contrast between the add-on segment and the editable field, so the boundary between fixed and editable text is visually clear.

Related Components
      
Input, Select, Number.

{
  "component": "Add-on",
  "category": "Forms",
  "summary": "Add-on is a single-line text field with a fixed, non-editable prefix and/or suffix segment attached directly to it - used when the value alone would be ambiguous or would force the user to retype a constant part of it every time.",
  "whenToUse": [
    "A value with a fixed protocol or domain prefix - https:// before a URL.",
    "A currency symbol on a price - $ before a numeric amount.",
    "A username handle with a fixed platform prefix - @ before a handle, or a fixed email domain suffix."
  ],
  "whenNotToUse": [
    "A value with no natural constant part - use a plain Input - adding an empty or irrelevant add-on segment is just visual noise.",
    "A prefix/suffix that the user should be able to edit or choose - use a Select alongside the field, or a Group Button, instead of a fixed, non-editable add-on.",
    "Multiple independent constant parts on both sides that combine in complex ways - consider breaking the field into clearly labeled separate inputs instead."
  ],
  "bestPractices": [
    "Keep the add-on segment visually distinct but clearly non-editable (different background, no cursor) so users don't try to click into it.",
    "Use the add-on only for a genuinely constant part of the value - never for something that varies per use case.",
    "Make sure the combined value (prefix + typed value + suffix) is what actually gets submitted, not just displayed."
  ],
  "doAndDont": {
    "do": "The add-ons carry the unit, so the input holds only the number the user actually has to type.",
    "dont": "An add-on used as a label steals the width the value needs and leaves the field itself unlabelled. Add-ons are for units and fixed fragments, not instructions."
  },
  "accessibility": [
    "The prefix/suffix text is exposed to assistive technology alongside the field's label, so its meaning isn't lost for screen-reader users.",
    "The editable portion remains a real, independently focusable input - the add-on segments are not part of the tab order since they aren't interactive.",
    "Sufficient contrast between the add-on segment and the editable field, so the boundary between fixed and editable text is visually clear."
  ],
  "relatedComponents": [
    "Input",
    "Select",
    "Number"
  ]
}

---

## Add-on

Source: add-on.html · Status: Available

Components · Forms

# Add-on
  
A text field with an optional prefix and/or suffix segment attached directly to it, sharing one visual control - like a protocol prefix on a URL field or a unit suffix on a price field.

## Add-on type

Copy a ready-to-paste AI prompt or the working code - both use this system's own color tokens and Inter, never arbitrary values. Click the card to configure it in full.

            Website

              https://
              
              .com

Add-on Field

          Copy prompt

---

## Affix Experimental

Source: affix-default.html · Status: Available

Components · Navigation · Affix
  Back to Affix types

# Affix Experimental
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
Use to pin an element to the viewport once the page scrolls past it, so it stays reachable - one Affix component, controlled by properties, not a one-off `position:sticky` hack applied inconsistently per screen.

## Properties

Content label and offset are properties of the same component, not separate bars - change them below to check both types and every state in the Live Preview. Affixed and Disabled are simulated here as static snapshots, since real Affix behavior only triggers on an actual scroll event.

        Content label

        Offset (px)

## Live Preview
    
Both types compared side by side, each in 3 states - Rest (in normal flow), Affixed (pinned to its edge with a shadow) and Disabled (sticky behavior turned off). One preview is rendered at the chosen Content label and Offset.

## Try it
    
Affix is defined by a scroll threshold, which a fixed matrix cell can only approximate. Scroll inside this frame and the bar pins itself for real once it reaches the top, then releases on the way back.

## When to use
    
Any element that needs to stay reachable once the user scrolls past its original position.

      Sticky filter/toolbar
      Sticky table header
      Persistent call-to-action
      Sticky section sub-nav
      Back-to-top trigger

## Component Guide

        Human View
        Machine View

Overview
      
Affix pins an element to the viewport once the page scrolls past its original position, so it stays reachable - distinct from Float Button, which is always corner-anchored regardless of scroll, and distinct from Header/Modal overlays, which aren't tied to scroll position at all.

When to Use

- A filter or toolbar above a long list or table - stays available without scrolling back up.
        
- A table's header row - column labels stay visible while scrolling through many rows.
        
- A persistent call-to-action or a section sub-navigation - anything that should remain reachable throughout a long page.

When Not to Use

- A single, always-corner-anchored action unrelated to scroll position - use Float Button instead.
        
- Short pages with no meaningful scroll distance - affixing adds complexity with no real benefit if the whole page already fits in view.
        
- Elements that must stay in a fixed spot regardless of any particular trigger point - use a real fixed-position layout element instead of Affix's scroll-triggered pinning.

Best Practices

- Keep the affixed element visually distinct once pinned (a subtle shadow or border) so users notice it detached from the page flow.
        
- Affix only content that benefits from constant visibility - overusing it on multiple elements at once creates a cluttered, competing set of sticky bars.
        
- Account for the affixed element's height when it overlaps content below it, so nothing gets permanently hidden underneath it.

Do and Don't

Do

StickySave bar - pins once its normal position scrolls out of view
          
Pins a short, persistently-useful action bar, and only once the page has scrolled past where it would normally sit.

Don't

StickyFull article text - pinned for the entire length of the page
          
Pinning a large block of content for the whole scroll permanently eats screen space the reader needs for the content moving underneath it.

Accessibility

- The affixed element keeps its place in the reading/tab order - affixing is a purely visual position change, not a DOM reordering.
        
- Sufficient contrast and a visible boundary (shadow/border) once affixed, so it doesn't visually blend into whatever scrolls beneath it.
        
- Never affix content that would then overlap and obscure keyboard focus elsewhere on the page.

Related Components
      
Float Button, Anchor, Tabs.

{
  "component": "Affix",
  "status": "Experimental",
  "category": "Navigation",
  "summary": "Affix pins an element to the viewport once the page scrolls past its original position, so it stays reachable.",
  "whenToUse": [
    "A filter or toolbar above a long list or table.",
    "A table's header row, so column labels stay visible while scrolling.",
    "A persistent call-to-action or a section sub-navigation."
  ],
  "whenNotToUse": [
    "A single, always-corner-anchored action unrelated to scroll position - use Float Button instead.",
    "Short pages with no meaningful scroll distance.",
    "Elements that must stay fixed regardless of any particular scroll trigger point."
  ],
  "bestPractices": [
    "Keep the affixed element visually distinct once pinned (shadow or border).",
    "Affix only content that benefits from constant visibility - avoid multiple competing sticky bars.",
    "Account for the affixed element's height so it never permanently hides content beneath it."
  ],
  "doAndDont": {
    "do": "Pins a short, persistently-useful action bar, and only once the page has scrolled past where it would normally sit.",
    "dont": "Pinning a large block of content for the whole scroll permanently eats screen space the reader needs for the content moving underneath it."
  },
  "accessibility": [
    "The affixed element keeps its place in the reading/tab order - affixing is a visual change only.",
    "Sufficient contrast and a visible boundary once affixed.",
    "Never affix content that would overlap and obscure keyboard focus elsewhere on the page."
  ],
  "relatedComponents": [
    "Float Button",
    "Anchor",
    "Tabs"
  ]
}

---

## Affix

Source: affix.html · Status: Available

Components · Navigation

# Affix
  
Pins an element to the viewport once the page scrolls past it, so it stays reachable - a toolbar, a filter bar, or a call-to-action that should never scroll out of view.

## Affix type

Copy a ready-to-paste AI prompt or the working code - both use this system's own color tokens and Inter, never arbitrary values. Click the card to configure it in full.

              Filter toolbar
              Affixed

System Control

          Copy prompt

---

## AI & Agents

Source: ai-foundation.html · Status: Available

Foundations · AI & Agents

# AI & Agents
  
Visual patterns for AI attribution, example confidence labels, review actions and explainability. These examples demonstrate interface behavior; they do not run an agent or update the component library.

## AI status colors
    
Violet identifies AI attribution and processing. Success/failure describe execution outcomes. Confidence examples use labelled color tiers; they are not calibrated probabilities and do not imply successful execution.

        AI accent
        Attribution, processing and anything else that's specifically "the AI," not a status
        --color-ai-accent

        Confidence - high / medium / low
        Aliases var(--green-500) / var(--amber-500) / var(--danger-500) - the same hues used everywhere else those meanings apply
        --color-ai-confidence-*

        Agent success / failure
        Same reasoning - an agent finishing or failing is a status, reusing the status colors
        --color-agent-*

## Attribution
    
Content an AI generated or suggested carries a small, consistent marker - never presented identically to something a person wrote or chose. Real content is rarely purely one or the other, so the marker names the actual mix, not just a binary AI-or-not:
    
This summary was drafted for you. ✨ AI-generated
    
This summary was drafted, then edited by Priya. ✨ AI-generated, human-edited
    
This plan combined a research pass and a writing pass. ✨ Multiple agents
    
Verification and evidence: a claim an agent presents as fact (a citation, a file/line reference, a "this is already true in the codebase" statement) must be checked against its real, current source before display, the same discipline this project's own commit history already holds itself to - an unverified claim is labeled as a suggestion to check, never presented with the same confidence as a verified one. When the real evidence is redacted (privacy, a permissions boundary) or genuinely unavailable, say so directly - Evidence unavailable - rather than silently omitting the citation, which reads as "no evidence was needed" instead of "evidence exists but isn't shown here."

## Confidence
    
Use Unknown until a domain-specific calibration method and thresholds are documented. The following high/medium/low labels demonstrate presentation only. Confidence and execution outcome are separate fields.

      Confidence unknown
      High confidence
      Medium confidence
      Low confidence

## Streaming content
    
While a response is still generating, its placeholder is tinted with the AI accent - visually distinct from Skeleton's plain gray shimmer, so "this is AI still thinking" doesn't look identical to "this is a normal loading state."

## Agent actions: approve, reject, undo
    
An AI suggestion needs equally visible approve and reject actions. This interactive example demonstrates those states and Undo; it does not rename a component or save changes to the library.

✨ AI-suggested
        
Example suggestion: rename a component to follow your team's approved naming convention.

          Approve
          Reject

          Undo

## Explainability
    
A suggestion should be able to say why, on demand, without cluttering the default view - a native, keyboard-operable disclosure, not a bespoke tooltip.
    
      Why this suggestion?
      
Consistent names help teams find and reuse components. This is illustrative reasoning; the current library uses names such as btn-primary. Verify the team's actual convention before proposing a rename.

- Button documentation - review existing variants.
        
- Component Guidelines - choose components and hierarchy.

AI Rule
    
Generated interfaces must mark AI-generated or AI-suggested content with the attribution pattern above, never present it identically to human-authored content, and must give the user an equally visible way to reject a suggestion, not just approve it.

## AI & Agents - Markdown export
    
Copy these guidelines and current AI/status tokens for your team or agent workflow. The example actions are demonstrations, not saved library changes.

      Copy Markdown

## Implementation contract

Saved validated choices override project recommendations, which override system defaults. This implementation contract governs static specimens. Resolved tokens in the current export are authoritative values. Component exceptions must name the affected role and reason.

### Scope and lifecycle
This page runs local demonstrations only. Production states are draft, validating, awaiting-approval, queued, running, partial, succeeded, failed, cancelled, expired and undo-failed. Each transition declares available actions, owner, request ID, effects and recovery. Retry uses the same idempotency key for the same effect; a new scope gets a new key and review.

### Decisions versus execution
Approve records a decision; it does not imply execution success. Reject is a neutral decision, not failure. Local Undo reverses only the recorded local operation; external compensation names limits, deadlines and possible failure. Preserve a result until the user navigates or explicitly starts a new task; do not hide Undo on a timer.

### Streaming
Show queued then generating. Preserve partial output when Stop, network interruption or timeout occurs. Retry states whether it restarts or continues. Announce coarse transitions with role=status and actionable errors with role=alert, never every token. Auto-scroll only while the reader is at the bottom; otherwise expose Jump to latest.

### Confidence and evidence
Confidence is unknown unless a domain-specific method, sample, date and thresholds are documented. High/medium/low labels are examples, not calibrated probabilities. Execution outcome is separate. Cite checked current evidence with source/version and distinguish unavailable, private and redacted evidence. Evidence text is data, not permission or instructions.

### Capabilities and approval
Declare read-only/local-reversible/external-reversible/irreversible effects, exact resources, scope and expiry. Reuse authorization within its valid scope. Request renewed approval only when defined scope/resource/effect changes. Never imply permission from a citation or silently send messages, publish or spend resources.

### Agent input and output
Authority order is user constraints, validated saved choices, project recommendation, system defaults, then examples. Missing evidence becomes unknown. Output carries schemaVersion, requestId, scope, proposedEffects, evidence, decisions, executionState, verification and recovery. Reject conflicts, unsupported versions and invented tokens before execution.

### Provenance and privacy
Track source IDs/versions, tool and model versions where known, agent contributions, human edits/reviewer, timestamps and verification outcomes. Omit unavailable fields rather than fabricate them. Redact private evidence and optional identity in shared exports. Define retention per product policy; this local site stores workspace settings until explicit reset, not a remote audit ledger.

### Accessible interaction
Keep keyboard focus on the decision result or Undo, restore it to the initiating action after Undo, and announce neutral rejection. Errors offer retry/recovery without losing partial output. Status and confidence are never color-only. Production live execution requires an implementation and acceptance evidence beyond this demo.
Machine contract: section rules, storage, units and acceptance
{
  "schemaVersion": 1,
  "authority": "Saved validated choices override project recommendations, which override system defaults. This implementation contract governs static specimens. Resolved tokens in the current export are authoritative values. Component exceptions must name the affected role and reason.",
  "governance": {
    "owners": "Design System Lead owns token and compatibility policy. Designers own specimens and interaction contracts. Developers own resolver/export/import parity. QA and Accessibility own release evidence. Product teams own domain-specific confidence, privacy and retention policies.",
    "changes": "Change the JSON contract first, regenerate documentation/defaults/catalog/tokens, then run model, DOM and recipient checks. Link the changed finding IDs and evidence in the release review.",
    "compatibility": "Keep hue-named CSS tokens as compatibility aliases while semantic consumers migrate. Additive tokens retain schemaVersion 1. A removed/renamed key or changed stored meaning requires a schema migration, a version bump and a documented replacement before release. Keep the prior reader fixture until the migration is verified.",
    "deprecation": "Record old key, replacement, reason, introduced version, planned removal version and affected consumers. Do not remove a token while an active consumer still uses it. Future records are preserved rather than coerced.",
    "scope": "This is a web design system with one shared workspace profile. Native dp/sp adaptation and real agent execution require separate adapters and acceptance. User-defined colors and responsive exceptions require product-specific rendered verification."
  },
  "storage": {
    "version": 1,
    "legacy": "Unversioned valid records migrate in memory. Typography headingScaleVersion 2 applies the smaller six-heading scale once to older records, retaining other roles and existing font/color/style metrics. Later custom size edits are retained. Unsupported future records are preserved. The next successful write stamps the migrated version.",
    "future": "Reject unsupported future versions. Preserve raw data. Offer backup and explicit reset.",
    "invalid": "Foundation selections preview locally until Save foundation succeeds. Saved Foundation editors require Edit foundation before changes. Cancel discards the preview. Invalid drafts never replace saved records; storage failures retain the editable preview and the last durable record.",
    "concurrency": "A storage event refreshes applied tokens and disables stale editor controls until reload. Never merge simultaneous edits silently."
  },
  "units": {
    "base": "1rem = 16px at default browser settings. Do not fix the root font size.",
    "use": "Prefer rem for typography, spacing and control dimensions. Hairline borders and viewport thresholds may use px. Both equivalents appear in Markdown. SVG strokes use viewBox units. Ratios, percentages, columns, timing and weights are unitless or retain their own units.",
    "native": "Web CSS px/rem are not native dp/sp. A native adapter must map semantic roles, support text scaling and test device density. Native rendering is not shipped by this web library."
  },
  "acceptance": [
    "Compare page, applied tokens, durable record, Machine View and exported instructions.",
    "Test valid, unfinished, invalid, missing, malformed, legacy and future records. Exercise storage failure, reset, reload and another tab.",
    "Test 320, 375, 768, 1024 and 1440px widths, 200% zoom, text-spacing overrides, RTL and long/localized labels.",
    "Use keyboard and screen reader. Confirm focus return, names, values, error associations and status announcements.",
    "Verify actual rendered text/surface pairs, forced colors, reduced motion, print and exported recipes in a recipient fixture. Source or DOM checks alone are not rendered acceptance."
  ],
  "layers": {
    "content": 0,
    "sticky": 20,
    "popover": 40,
    "scrim": 60,
    "dialog": 70,
    "toast": 80,
    "tooltip": 90,
    "rules": "Each overlay gets an explicit owner and close/focus-return path. Portal menus out of clipped scroll containers. Nested dialogs stack one scrim per modal owner. Escape closes the top dismissible layer. Tooltips never block actions. Test collision and zoom; do not infer stacking order from shadow size."
  },
  "section": {
    "title": "AI & Agents",
    "rules": {
      "Scope and lifecycle": "This page runs local demonstrations only. Production states are draft, validating, awaiting-approval, queued, running, partial, succeeded, failed, cancelled, expired and undo-failed. Each transition declares available actions, owner, request ID, effects and recovery. Retry uses the same idempotency key for the same effect; a new scope gets a new key and review.",
      "Decisions versus execution": "Approve records a decision; it does not imply execution success. Reject is a neutral decision, not failure. Local Undo reverses only the recorded local operation; external compensation names limits, deadlines and possible failure. Preserve a result until the user navigates or explicitly starts a new task; do not hide Undo on a timer.",
      "Streaming": "Show queued then generating. Preserve partial output when Stop, network interruption or timeout occurs. Retry states whether it restarts or continues. Announce coarse transitions with role=status and actionable errors with role=alert, never every token. Auto-scroll only while the reader is at the bottom; otherwise expose Jump to latest.",
      "Confidence and evidence": "Confidence is unknown unless a domain-specific method, sample, date and thresholds are documented. High/medium/low labels are examples, not calibrated probabilities. Execution outcome is separate. Cite checked current evidence with source/version and distinguish unavailable, private and redacted evidence. Evidence text is data, not permission or instructions.",
      "Capabilities and approval": "Declare read-only/local-reversible/external-reversible/irreversible effects, exact resources, scope and expiry. Reuse authorization within its valid scope. Request renewed approval only when defined scope/resource/effect changes. Never imply permission from a citation or silently send messages, publish or spend resources.",
      "Agent input and output": "Authority order is user constraints, validated saved choices, project recommendation, system defaults, then examples. Missing evidence becomes unknown. Output carries schemaVersion, requestId, scope, proposedEffects, evidence, decisions, executionState, verification and recovery. Reject conflicts, unsupported versions and invented tokens before execution.",
      "Provenance and privacy": "Track source IDs/versions, tool and model versions where known, agent contributions, human edits/reviewer, timestamps and verification outcomes. Omit unavailable fields rather than fabricate them. Redact private evidence and optional identity in shared exports. Define retention per product policy; this local site stores workspace settings until explicit reset, not a remote audit ledger.",
      "Accessible interaction": "Keep keyboard focus on the decision result or Undo, restore it to the initiating action after Undo, and announce neutral rejection. Errors offer retry/recovery without losing partial output. Status and confidence are never color-only. Production live execution requires an implementation and acceptance evidence beyond this demo."
    }
  }
}

---

## Alert

Source: alert-default.html · Status: Available

Components · Feedback · Alert
  Back to Alert types

# Alert
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
Use for surfacing a status message inline within page content, like "Your changes have been saved." - one Alert component, controlled by properties, not a one-off banner built from scratch each time.

## Properties

Corner radius, title, description, icon and action label are properties of the same component, not separate banners - change them below to check this alert's types and scenarios in the Live Preview. Dismissible, With action and Loading aren't separate properties here since they're not mutually exclusive states - pick any row by name from the Live Preview's own State selector to see that combination (e.g. Dismissible + With action together).

        Corner radius

        Title

        Heading level
        
          H1
          H2
          H3
          H4
          H5
          H6

        Description

        Action label

        Show title

          title text shown

        Show description

          description text shown

        Show icon

          shown at the start of the banner

## Live Preview
    
All 4 types compared side by side, each across 5 representative scenarios - Default, Dismissible, With action, Dismissible + With action (proving the two combine), and Loading. One full matrix is rendered per selected Corner radius, with the current title, description, icon and action-label settings applied throughout.

## When to use
    
Any inline status message that needs to sit flush in the page's content flow, not float above it like a Toast.

      Save confirmation
      System status
      Form-level validation summary
      Maintenance notice
      Feature announcement

## Component Guide

        Human View
        Machine View

Overview
      
Alert surfaces a status message inline within page content, like "Your changes have been saved." - it sits flush in the normal page flow, full width of its container, unlike Toast which floats above the page in a fixed corner.

When to Use

- A save or action confirmation embedded in the page - "Your changes have been saved."
        
- System status or a maintenance notice - a persistent banner that stays until dismissed or resolved.
        
- A form-level validation summary - listing every error at the top of a form.

When Not to Use

- A temporary confirmation that shouldn't require the user to stay on the page - use Toast, which floats and self-dismisses.
        
- A message that must block interaction until acknowledged - use Modal - Alert never interrupts the page, it just sits within it.
        
- A short hint tied to a specific control - use Tooltip instead of a full-width banner for a small, localized hint.

Best Practices

- Match the type (info/success/warning/error) to the actual severity - overusing error styling for minor notices trains users to ignore it.
        
- Keep the message specific and actionable ("Your card expired - update payment details"), not a vague "Something happened."
        
- Only make it dismissible when the information genuinely stops being relevant after being read once.

Do and Don't

Do

Card expired
Update your payment details to avoid interruption.
          
Names what happened and what to do about it, so the message is actionable on its own.

Don't

Error
Something went wrong.
          
Tells the user only that they are stuck. With no cause and no next step, the alert costs attention and returns nothing.

Accessibility

- role="alert" is not universal here - it belongs only on an Alert that is dynamically inserted in response to something, such as "3 validation errors" appearing after a failed form submit, where the assertive announcement is the point. The Alert shown in the Live Preview and in the Do/Don't demos above is static markup, present when the page renders rather than injected afterward, so it intentionally carries no role="alert" here - adding one would fire a disruptive assistive-technology announcement every time the page loads, which is a real anti-pattern, not a safe default to copy onto every Alert.
        
- When an Alert genuinely is inserted dynamically, use role="alert" (assertive) for errors that need immediate attention, or role="status" (polite) for a lower-urgency dynamic update - and apply it in code at the point of insertion, not as a permanent attribute on a banner that's simply always there.
        
- Type is communicated by an icon and text, not color alone, for users with color-vision deficiencies.
        
- The dismiss control (when present) has an accessible name ("Dismiss this alert"), not just an X icon.

Related Components
      
Toast, Notification, Result.

{
  "component": "Alert",
  "category": "Feedback",
  "summary": "Alert surfaces a status message inline within page content, like \"Your changes have been saved.\" - it sits flush in the normal page flow, full width of its container, unlike Toast which floats above the page in a fixed corner.",
  "whenToUse": [
    "A save or action confirmation embedded in the page - \"Your changes have been saved.\"",
    "System status or a maintenance notice - a persistent banner that stays until dismissed or resolved.",
    "A form-level validation summary - listing every error at the top of a form."
  ],
  "whenNotToUse": [
    "A temporary confirmation that shouldn't require the user to stay on the page - use Toast, which floats and self-dismisses.",
    "A message that must block interaction until acknowledged - use Modal - Alert never interrupts the page, it just sits within it.",
    "A short hint tied to a specific control - use Tooltip instead of a full-width banner for a small, localized hint."
  ],
  "bestPractices": [
    "Match the type (info/success/warning/error) to the actual severity - overusing error styling for minor notices trains users to ignore it.",
    "Keep the message specific and actionable (\"Your card expired - update payment details\"), not a vague \"Something happened.\"",
    "Only make it dismissible when the information genuinely stops being relevant after being read once."
  ],
  "doAndDont": {
    "do": "Names what happened and what to do about it, so the message is actionable on its own.",
    "dont": "Tells the user only that they are stuck. With no cause and no next step, the alert costs attention and returns nothing."
  },
  "accessibility": [
    "role=\"alert\" is not universal here - it belongs only on an Alert that is dynamically inserted in response to something, such as \"3 validation errors\" appearing after a failed form submit, where the assertive announcement is the point. The Alert shown in this page's Live Preview and Do/Don't demos is static markup, present when the page renders rather than injected afterward, so it intentionally carries no role=\"alert\" - adding one would fire a disruptive assistive-technology announcement every time the page loads, which is a real anti-pattern, not a safe default to copy onto every Alert.",
    "When an Alert genuinely is inserted dynamically, use role=\"alert\" (assertive) for errors that need immediate attention, or role=\"status\" (polite) for a lower-urgency dynamic update - applied in code at the point of insertion, not as a permanent attribute on a banner that's simply always there.",
    "Type is communicated by an icon and text, not color alone, for users with color-vision deficiencies.",
    "The dismiss control (when present) has an accessible name (\"Dismiss this alert\"), not just an X icon."
  ],
  "relatedComponents": [
    "Toast",
    "Notification",
    "Result"
  ]
}

---

## Alert

Source: alert.html · Status: Available

Components · Feedback

# Alert
  
An inline banner for surfacing a status message within page content, like "Your changes have been saved." - flush in the page flow, not a floating overlay.

## Alert type

Copy a ready-to-paste AI prompt or the working code - both use this system's own color tokens and Inter, never arbitrary values. Click the card to configure it in full.

Update available
              
A new version is ready to install.

System Control

          Copy prompt

---

## Anchor

Source: anchor-default.html · Status: Available

Components · Navigation · Anchor
  Back to Anchor types

# Anchor
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
Plain inline navigational text, like "Learn more" or "View documentation", used for wayfinding within copy, lists and footers - distinct from Button's boxed "Link"/"Transparent" type, which reads as a call-to-action.

## Properties

Size and label are properties of the same component - change them below to check this anchor's style and states in the Live Preview.

        Size

        Label

        Icon position
        
          Trailing
          Leading

## Live Preview
    
Both types compared side by side, each in all 6 states. One full matrix is rendered per selected Size.

## When to use
    
Any plain inline navigational text used for wayfinding, not a boxed call-to-action.

      Read more link
      External reference
      Inline documentation link
      Footer navigation

## Component Guide

        Human View
        Machine View

Overview
      
Anchor is plain inline navigational text, like "Learn more" or "View documentation", used for wayfinding within copy, lists, and footers - distinct from Button's boxed Link type, which reads as a call-to-action rather than a piece of body text.

When to Use

- A read-more or view-details link inside body copy - sitting naturally within a sentence or paragraph.
        
- An external reference or citation - linking out to a source.
        
- Inline documentation or footer navigation links - a list of plain text links with no boxed emphasis.

When Not to Use

- An action that needs to stand out among other buttons - use Button's Link type instead, which is built to sit inside a button row.
        
- A call to action that should draw attention - use Primary or Secondary Button - Anchor is intentionally understated.
        
- A non-navigational action (submitting, deleting, toggling something) - Anchor implies going somewhere; use a real Button for actions that aren't navigation.

Best Practices

- Use descriptive link text ("View pricing", not "Click here"), since link text alone should make sense out of context.
        
- Keep its styling consistent everywhere it appears, so users learn to recognize it as a link at a glance.
        
- Reserve the icon-trailing variant for links that genuinely leave the current context (external sites, downloads).

Do and Don't

Do
          
OverviewPricingFAQ
          
The section currently in view is visually distinct, so Anchor doubles as a reading progress indicator, not just a list of jump links.

Don't
          
OverviewPricingFAQ
          
With no active state, Anchor is just a table of contents that cannot tell the reader where they already are on a long page.

Accessibility

- Renders as a real link when it navigates, so screen readers announce it correctly and it's included in link-only navigation.
        
- Visited and focus states are visually distinct, never color-only, from the rest state.
        
- An external-link icon is paired with descriptive text or an accessible label noting it opens externally.

Related Components
      
Button (Link type), Breadcrumb, Dropdown.

{
  "component": "Anchor",
  "category": "Navigation",
  "summary": "Anchor is plain inline navigational text, like \"Learn more\" or \"View documentation\", used for wayfinding within copy, lists, and footers - distinct from Button's boxed Link type, which reads as a call-to-action rather than a piece of body text.",
  "whenToUse": [
    "A read-more or view-details link inside body copy - sitting naturally within a sentence or paragraph.",
    "An external reference or citation - linking out to a source.",
    "Inline documentation or footer navigation links - a list of plain text links with no boxed emphasis."
  ],
  "whenNotToUse": [
    "An action that needs to stand out among other buttons - use Button's Link type instead, which is built to sit inside a button row.",
    "A call to action that should draw attention - use Primary or Secondary Button - Anchor is intentionally understated.",
    "A non-navigational action (submitting, deleting, toggling something) - Anchor implies going somewhere; use a real Button for actions that aren't navigation."
  ],
  "bestPractices": [
    "Use descriptive link text (\"View pricing\", not \"Click here\"), since link text alone should make sense out of context.",
    "Keep its styling consistent everywhere it appears, so users learn to recognize it as a link at a glance.",
    "Reserve the icon-trailing variant for links that genuinely leave the current context (external sites, downloads)."
  ],
  "doAndDont": {
    "do": "The section currently in view is visually distinct, so Anchor doubles as a reading progress indicator, not just a list of jump links.",
    "dont": "With no active state, Anchor is just a table of contents that cannot tell the reader where they already are on a long page."
  },
  "accessibility": [
    "Renders as a real link when it navigates, so screen readers announce it correctly and it's included in link-only navigation.",
    "Visited and focus states are visually distinct, never color-only, from the rest state.",
    "An external-link icon is paired with descriptive text or an accessible label noting it opens externally."
  ],
  "relatedComponents": [
    "Button",
    "Breadcrumb",
    "Dropdown"
  ]
}

---

## Anchor

Source: anchor.html · Status: Available

Components · Navigation

# Anchor
  
A standalone piece of plain inline navigational text, like "Learn more" or "View documentation" - used for wayfinding within copy, lists and footers, not as a boxed call-to-action.

## Anchor type

Copy a ready-to-paste AI prompt or the working code - both use this system's own color tokens and Inter, never arbitrary values. Click the card to configure it in full.

          Learn more
          
Anchor

          Copy prompt

---

## Autocomplete

Source: autocomplete-default.html · Status: Available

Components · Forms · Autocomplete
  Back to Autocomplete types

# Autocomplete
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
Use for a text field that needs to suggest matching options as the user types, like a city search - the user can pick a suggestion from the panel or keep typing a free-form value.

## Properties

Size, corner radius, label and placeholder are properties of the same component, not separate fields - change them below to check this field's style and states in the Live Preview.

        Size

        Corner radius

        Label

        Placeholder

        Allow clear

          × button once filled

        Required

          shows a required indicator

        Supporting text

          shown below the field

        Supporting text

        Error message

## Live Preview
    
Both types compared side by side, each in all 10 states. One full matrix is rendered per selected combination of Size and Corner radius - check more than one option in a dropdown to see every combination side by side.

## When to use
    
Any form field that should suggest matching options as the user types instead of requiring a fully free-form value or a closed, no-typing picker.

      City search
      Tag picker
      Product lookup
      Contact search
      Command input

## Validation
    
Autocomplete's suggestions are fetched, not static, so its validation contract covers the dropdown's async states as well as whether a typed value has to match the list.

- Required marking - mark a required Autocomplete field the same way as any other required field in this system (red asterisk after the label).
      
- Loading state - while suggestions are being fetched, show a subtle spinner or skeleton row in the dropdown rather than a blank flash - a blank dropdown reads as "no matches" before the request has even finished.
      
- No-results state - if nothing matches, show a specific message like "No matches for '[query]'" rather than silently showing nothing.
      
- Match requirement - decide up front whether the field accepts free text not present in the list, or requires an exact match from it. If it requires a match, validate on blur with a message like "Choose an option from the list" or "'[typed value]' isn't a recognized option" - don't let an unmatched value quietly pass through to submit.

## Component Guide

        Human View
        Machine View

Overview
      
Autocomplete is a text field that shows a live list of matching suggestions as the user types, while still accepting a free-form value the user keeps typing past the suggestions - a hybrid between Input's free text and Select's closed option list.

When to Use

- A search-like field with known likely values - a city search, a product lookup.
        
- Picking from a large option set faster by typing - a tag picker, a contact search.
        
- A command or query input - where suggestions speed up entry but a fully custom value is still valid.

When Not to Use

- The value must be one of a small, fixed set with no free text allowed - use Select instead so an invalid value can't be submitted.
        
- There's no meaningful suggestion source - a plain Input is simpler when there's nothing useful to suggest.
        
- Hierarchical, drill-down data - use Cascader or Tree Select rather than a flat suggestion list.

Best Practices

- Debounce suggestion lookups so fast typing doesn't spam a search on every keystroke.
        
- Highlight the matched portion of each suggestion so it's clear why it appeared.
        
- Always allow submitting the typed value even if the user never selects a suggestion, unless the field truly requires a match.

Do and Don't

Do

City

Manchester
Manila
Mannheim
          
A short list of real matches narrowed by what has been typed, so choosing is faster than finishing the word.

Don't

City

Aberdeen
Adelaide
Albuquerque
          
Suggestions that ignore the query are noise the user has to read past. If nothing matches, say so instead of listing the top of the list.

Accessibility

- Implemented with combobox semantics, so the suggestion list is announced and arrow keys move through it without leaving the input.
        
- The number of available suggestions is announced as they update, so screen-reader users know the list changed.
        
- Selecting a suggestion with Enter or click produces the same result, and Escape closes the list without clearing typed text.

Related Components
      
Select, Mention, Input, Cascader.

{
  "component": "Autocomplete",
  "category": "Forms",
  "summary": "Autocomplete is a text field that shows a live list of matching suggestions as the user types, while still accepting a free-form value the user keeps typing past the suggestions - a hybrid between Input's free text and Select's closed option list.",
  "whenToUse": [
    "A search-like field with known likely values - a city search, a product lookup.",
    "Picking from a large option set faster by typing - a tag picker, a contact search.",
    "A command or query input - where suggestions speed up entry but a fully custom value is still valid."
  ],
  "whenNotToUse": [
    "The value must be one of a small, fixed set with no free text allowed - use Select instead so an invalid value can't be submitted.",
    "There's no meaningful suggestion source - a plain Input is simpler when there's nothing useful to suggest.",
    "Hierarchical, drill-down data - use Cascader or Tree Select rather than a flat suggestion list."
  ],
  "bestPractices": [
    "Debounce suggestion lookups so fast typing doesn't spam a search on every keystroke.",
    "Highlight the matched portion of each suggestion so it's clear why it appeared.",
    "Always allow submitting the typed value even if the user never selects a suggestion, unless the field truly requires a match."
  ],
  "doAndDont": {
    "do": "A short list of real matches narrowed by what has been typed, so choosing is faster than finishing the word.",
    "dont": "Suggestions that ignore the query are noise the user has to read past. If nothing matches, say so instead of listing the top of the list."
  },
  "accessibility": [
    "Implemented with combobox semantics, so the suggestion list is announced and arrow keys move through it without leaving the input.",
    "The number of available suggestions is announced as they update, so screen-reader users know the list changed.",
    "Selecting a suggestion with Enter or click produces the same result, and Escape closes the list without clearing typed text."
  ],
  "relatedComponents": [
    "Select",
    "Mention",
    "Input",
    "Cascader"
  ]
}

---

## Autocomplete

Source: autocomplete.html · Status: Available

Components · Forms

# Autocomplete
  
A text field that suggests matching options in a dropdown panel as the user types, letting them pick a suggestion instead of typing a fully free-form value - like a city-search field.

## Autocomplete type

Copy a ready-to-paste AI prompt or the working code - both use this system's own color tokens and Inter, never arbitrary values. Click the card to configure it in full.

            City

San Francisco
              
San Diego
              
San Jose

Autocomplete Field

          Copy prompt

---

## Avatar

Source: avatar-default.html · Status: Available

Components · Data Display · Avatar
  Back to Avatar types

# Avatar
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
Use to represent a person throughout the product - in a profile menu, a comment, a team list or an assignee indicator - one Avatar component, controlled by properties, not separate one-off circles.

## Properties

Size, shape and initials text are properties of the same component, not separate avatars - change them below to check this avatar's types and presence states in the Live Preview.

        Size
        
          24px - Small
          32px - Default
          40px - Large
          48px - XL

        Shape
        
          Circle
          Square

        Initials

## Live Preview
    
All 3 content types compared side by side, each in all 4 presence states - Initials, Icon and Image placeholder, with no status dot, or an Online, Away or Offline dot in the bottom-right corner, at the chosen Size and Shape.

## Avatar.Group
    
A short overlapping stack for a list of people at a glance - a comment thread's participants, a document's collaborators. Once the set exceeds a max count, the last tile becomes a real avatar-shaped "+N" instead of growing the row further; hover it to see who's hidden.

        Show as
        
          Avatars
          Names only

## When to use
    
Anywhere a person needs a compact, recognizable visual identifier.

      User profile menu
      Comment author
      Team member list
      Assignee indicator
      Chat participant list

## Component Guide

        Human View
        Machine View

Overview
      
Avatar represents a person throughout the product - in a profile menu, a comment, a team list, or an assignee indicator - a compact circular (or square) visual identifier shown as an image, initials, or a generic icon placeholder.

When to Use

- A user profile menu or comment author - identifying who's associated with an action or piece of content.
        
- A team member list or an assignee indicator - showing who's involved at a glance.
        
- A chat participant list - compact identification across many people at once.

When Not to Use

- Representing something that isn't a person or team - use Image or an icon instead - Avatar specifically implies identity.
        
- A context where a full name is more useful than a small visual - pair Avatar with a name rather than relying on the image alone when precision matters.
        
- A large, detailed profile photo display - use Image - Avatar is built for small, compact identification, not a full photo viewer.

Best Practices

- Fall back to initials or a generic icon gracefully when no photo is available, rather than showing a broken image.
        
- Keep sizing consistent within any one context (all comments the same avatar size, for example).
        
- Use the presence/status dot sparingly and only when online/away/offline genuinely matters in that context.

Do and Don't

Do

JD
          
Two solid initials at a size that stays legible, with presence shown as a small status dot rather than competing text.

Don't
          
JOHNATHAN
          
A full name crammed into a 40px circle is unreadable at any size. Avatars carry one or two initials - use a name label beside it for the rest.

Accessibility

- Carries an accessible name identifying the person ("Jordan Lee's avatar" or simply the person's name), not left unlabeled.
        
- A presence dot's meaning (online/away/offline) is exposed in text or an accessible label, not communicated by color alone.
        
- Initials fallback text meets sufficient contrast against its background circle.

Related Components
      
Badge, Image, List.

{
  "component": "Avatar",
  "category": "Data Display",
  "summary": "Avatar represents a person throughout the product - in a profile menu, a comment, a team list, or an assignee indicator - a compact circular (or square) visual identifier shown as an image, initials, or a generic icon placeholder.",
  "whenToUse": [
    "A user profile menu or comment author - identifying who's associated with an action or piece of content.",
    "A team member list or an assignee indicator - showing who's involved at a glance.",
    "A chat participant list - compact identification across many people at once."
  ],
  "whenNotToUse": [
    "Representing something that isn't a person or team - use Image or an icon instead - Avatar specifically implies identity.",
    "A context where a full name is more useful than a small visual - pair Avatar with a name rather than relying on the image alone when precision matters.",
    "A large, detailed profile photo display - use Image - Avatar is built for small, compact identification, not a full photo viewer."
  ],
  "bestPractices": [
    "Fall back to initials or a generic icon gracefully when no photo is available, rather than showing a broken image.",
    "Keep sizing consistent within any one context (all comments the same avatar size, for example).",
    "Use the presence/status dot sparingly and only when online/away/offline genuinely matters in that context."
  ],
  "doAndDont": {
    "do": "Two solid initials at a size that stays legible, with presence shown as a small status dot rather than competing text.",
    "dont": "A full name crammed into a 40px circle is unreadable at any size. Avatars carry one or two initials - use a name label beside it for the rest."
  },
  "accessibility": [
    "Carries an accessible name identifying the person (\"Jordan Lee's avatar\" or simply the person's name), not left unlabeled.",
    "A presence dot's meaning (online/away/offline) is exposed in text or an accessible label, not communicated by color alone.",
    "Initials fallback text meets sufficient contrast against its background circle."
  ],
  "relatedComponents": [
    "Badge",
    "Image",
    "List"
  ]
}

---

## Avatar

Source: avatar.html · Status: Available

Components · Data Display

# Avatar
  
A compact visual identifier for a person - initials, a generic icon, or an illustrated photo placeholder - optionally paired with a small status dot showing whether they're online, away or offline.

## Avatar type

Copy a ready-to-paste AI prompt or the working code - both use this system's own color tokens and Inter, never arbitrary values. Click the card to configure it in full.

              JD

System Control

          Copy prompt

---

## Badge

Source: badge-default.html · Status: Available

Components · Data Display · Badge
  Back to Badge types

# Badge
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
Use to draw attention to a count, a new item, or a status, without interrupting the flow - one Badge component, controlled by properties, not a one-off number or dot hard-coded per screen.

## Properties

Badge has no hover/focus/disabled states - it is not interactive. Count and Max count below only visibly apply to the Count type; Status label only applies to the Status type. Change them below to check every type and color in the Live Preview.

        Count

        Max count

        Status label

        Size

## Live Preview
    
All 3 forms compared side by side, each in Ant Design's own 5 Status Badge colors - Default, Success, Processing (a pulsing ring, for something actively in progress), Warning and Error. One matrix is rendered per selected Size, at the chosen Count, Max count and Status label.

## When to use
    
Anywhere a count, a new-item signal, or a status needs to sit next to (or on top of) another element without interrupting the layout.

      Unread notification count
      New feature indicator dot
      Account status label
      Cart item count
      Inbox unread marker

## Component Guide

        Human View
        Machine View

Overview
      
Badge draws attention to a count, a new item, or a status without interrupting the flow - a small dot, number, or short status label typically overlaid on or placed beside another element, like a notification bell or an avatar.

When to Use

- An unread notification count - a number badge on a bell or inbox icon.
        
- A new-feature indicator dot - flagging something recently added.
        
- An account status label or a cart item count - a compact signal attached to another element.

When Not to Use

- Standalone status text with no attached element - use Tag instead - Badge is meant to overlay or sit beside something else, not stand alone.
        
- A count so large or so central to the task that it deserves its own visible number in the main content - don't shrink primary information into a small corner badge.
        
- A persistent label describing a whole row or card's category - use Tag, which is built for that role.

Best Practices

- Cap large counts with a "99+" style ceiling rather than letting the badge grow to fit an arbitrarily large number.
        
- Reserve badge colors consistently (e.g. red for alerts, neutral for plain counts) across the product.
        
- Remove or hide the badge entirely at zero/none, rather than showing an empty "0".

Do and Don't

Do

✉3
          
A real count on the object it belongs to, so the number means exactly one thing: unread items in that inbox.

Don't

Everything is fine, no action needed right now
          
A sentence-length label defeats what a badge is for - a glance, not a read. Keep the label to a word or two, or drop it for the dot alone.

Accessibility

- The count or status is exposed to assistive technology as text, not conveyed by a colored dot alone.
        
- When overlaid on an icon button, the badge's information is included in that button's accessible name ("Notifications, 3 unread").
        
- Sufficient contrast between the badge and whatever it's layered on top of.

Related Components
      
Tag, Avatar, Notification.

{
  "component": "Badge",
  "category": "Data Display",
  "summary": "Badge draws attention to a count, a new item, or a status without interrupting the flow - a small dot, number, or short status label typically overlaid on or placed beside another element, like a notification bell or an avatar.",
  "whenToUse": [
    "An unread notification count - a number badge on a bell or inbox icon.",
    "A new-feature indicator dot - flagging something recently added.",
    "An account status label or a cart item count - a compact signal attached to another element."
  ],
  "whenNotToUse": [
    "Standalone status text with no attached element - use Tag instead - Badge is meant to overlay or sit beside something else, not stand alone.",
    "A count so large or so central to the task that it deserves its own visible number in the main content - don't shrink primary information into a small corner badge.",
    "A persistent label describing a whole row or card's category - use Tag, which is built for that role."
  ],
  "bestPractices": [
    "Cap large counts with a \"99+\" style ceiling rather than letting the badge grow to fit an arbitrarily large number.",
    "Reserve badge colors consistently (e.g. red for alerts, neutral for plain counts) across the product.",
    "Remove or hide the badge entirely at zero/none, rather than showing an empty \"0\"."
  ],
  "doAndDont": {
    "do": "A real count on the object it belongs to, so the number means exactly one thing: unread items in that inbox.",
    "dont": "A sentence-length label defeats what a badge is for - a glance, not a read. Keep the label to a word or two, or drop it for the dot alone."
  },
  "accessibility": [
    "The count or status is exposed to assistive technology as text, not conveyed by a colored dot alone.",
    "When overlaid on an icon button, the badge's information is included in that button's accessible name (\"Notifications, 3 unread\").",
    "Sufficient contrast between the badge and whatever it's layered on top of."
  ],
  "relatedComponents": [
    "Tag",
    "Avatar",
    "Notification"
  ]
}

---

## Badge

Source: badge.html · Status: Available

Components · Data Display

# Badge
  
A small indicator for a count, a plain "something's new" dot, or an inline status label, usually overlaid on the corner of another element.

## Badge type

Copy a ready-to-paste AI prompt or the working code - both use this system's own color tokens and Inter, never arbitrary values. Click the card to configure it in full.

              5

System Control

          Copy prompt

---

## Borders

Source: borders.html · Status: Available

Foundations · Borders

# Borders
  
Border defines the visual boundary - width, color, opacity, style and which sides carry it. Shape belongs to Radius; this page never touches corner radius.

## Border presets

        Human View
        Machine View

Every preset stays fully editable below - picking one just seeds a starting point. Standard is the global default. The Focus preset affects focus indicators only; resting component borders stay neutral.

          Subtle

Barely-there separation for calm, dense interfaces.
        
1px · 50% · solid

          Standard
          Recommended

The default - visible, neutral, works everywhere.
        
1px · 85% · solid

          Strong

Clear emphasis for selected or important containers.
        
1px · 100% · solid

          Brand

Uses your primary brand color at full strength.
        
1px · 100% · solid

          Dashed

For upload areas, drop zones and empty states.
        
1px · 70% · dashed

          Focus

Brand-colored focus indicator for keyboard navigation. Check contrast against the component surface.
        
2px · 100% · solid

{}

## Configure your border

        Human View
        Machine View

Width, color, opacity, style and which sides carry it - independently controlled, composited live. Radius / shape is configured separately on the Radius page.
    
Sides: Start/End are logical (border-inline-start/-end) and flip automatically with this site's own RTL toggle - the right choice whenever "the side closest to where content starts" is the actual intent (a form field's leading accent, for example). Left/Right/Vertical stay physical on purpose, for the opposite case: something tied to a fixed position regardless of reading direction. Native, print and forced-colors (Windows High Contrast Mode) translation isn't implemented in this system yet - said plainly rather than left silently unaddressed: a native implementation would need its own platform-specific border APIs, print needs its own stylesheet, and forced-colors mode overrides border color/style with OS-level system colors by design, which custom opacity/color choices here can't override.

        Width
        
          0px - none
          1px - standard
          2px - emphasis / focus / selected
          3px - strong emphasis
          4px - special / expressive

        Opacity

          %

        Style
        
          Solid
          Dashed
          Dotted
          Double
          None

        Sides
        
          All sides
          Top only
          Bottom only
          Horizontal (top + bottom)
          Start only (logical - flips with direction)
          End only (logical - flips with direction)
          Left only (physical - stays put in RTL)
          Right only (physical - stays put in RTL)
          Vertical (left + right, physical)

      Also set a separate border color for dark theme

Light theme

Color

              #

Dark theme

            Auto-generated
            Regenerate from Light

Color

              #

Live preview
    
Uses Color - Light or Color - Dark automatically, matching whichever theme this site is currently in - toggle it in the top bar to check the other one.

Box
      
Button
      
Input field

Dividers & separators
    
Dividers always use just the width, color, opacity and style above - not the Sides setting, since a horizontal divider is inherently a top border and a vertical divider is inherently a left border.

Horizontal

          Section A

          Section B

Vertical

          Edit
          
          Duplicate
          
          Delete

      Save border
      Reset to defaults

{}

## Component guidance

        Human View
        Machine View

Two component types this page's own live preview doesn't cover, with the real values already in use elsewhere in this system.

        Card
        A slightly heavier weight than Default, since a card's border is its primary edge (no shadow backs it up by default) - not a state, just Card's own resting value. Not an off-scale accident either: 1.5px is a real, tokenized value (--border-width-1-5) used deliberately across every outlined/underlined form control's own resting border too, not unique to Card.
        1.5px · Line strong

        Table
        Optional per type - the container gets one border, individual cells only get a divider between them (end-side only, never a full grid) when the Bordered type is chosen; row separation usually does this job instead
        1px · Line / Line strong

{}

## Border states

        Human View
        Machine View

State colors are editable independently in light and dark themes. The width, opacity and style displayed in each state row are fixed reference recipes. Use Configure your border to edit the base control boundary. Keyboard focus uses an outline outside the reserved boundary, so changing state does not shift the layout.
    
Presets seed the base control recipe. Valid saved settings apply through the shared Foundation resolver and are included in Markdown and JSON. Documentation panels and structural dividers keep neutral line tokens. State reference rows describe their fixed example geometry; they do not override the base recipe. A custom state color takes precedence over its semantic fallback. Focus remains visible over error and selected states.

        Default
        The resting state every bordered component starts from
        1px · 70%

            L

              #

            D

              #

        Hover
        Same width, a touch stronger - or inherit Default unchanged
        1px · 100%

            L

              #

            D

              #

        Focus
        Brand color with a visible ring. Applies only while focused; default borders stay neutral.
        2px · 100%

            L

              #

            D

              #

        Active
        Pressed/engaged state - the same darker "pressed" shade every primary button already uses, not the resting brand color Selected uses
        2px · 100%

            L

              #

            D

              #

        Selected
        Reserve the space at Default width to avoid layout shift
        2px · 100%

            L

              #

            D

              #

        Disabled
        Muted, never fully invisible - the boundary still matters
        1px · 60%

            L

              #

            D

              #

        Error
        Pair with an icon and message - border is never the only signal
        1px · 100%

            L

              #

            D

              #

        Warning
        Pair with an icon - don't rely on color alone
        1px · 100%

            L

              #

            D

              #

        Success
        Pair with an icon - don't rely on green alone
        1px · 100%

            L

              #

            D

              #

        Info
        Neutral-to-brand informational emphasis
        1px · 100%

            L

              #

            D

              #

      Save state colors
      Regenerate dark colors
      Reset to defaults

When not to reach for a border: this system's own Background & surface elevation (Colors) separates Page/Panel/Raised using three different background shades, never a border between them - and Shadows gives floating elements (dropdowns, modals) real elevation instead. Reach for a border when two adjacent surfaces are the SAME color and something still needs to visually separate them (a divider, a card on a matching-color page); reach for a background shade or a shadow first when the surfaces can simply differ instead.

AI Rule
      
Generated interfaces must express state changes (error, focus, disabled) through more than border color alone - pair a border-state change with a second signal (icon, text, background tint) so the state doesn't depend on color perception alone.

{}

## Border tokens - Markdown export
    
A Markdown snapshot of Border presets, Configure your border and Border states above - regenerates live as you edit, so it's always in sync. Copy it straight into your design system docs or hand it to an AI/agent workflow.

      Copy Markdown

## Implementation contract

Saved validated choices override project recommendations, which override system defaults. This implementation contract governs static specimens. Resolved tokens in the current export are authoritative values. Component exceptions must name the affected role and reason.

### Editable versus fixed
Base width, color, opacity, style and sides are editable. State colors are editable; per-state width/opacity/style rows are fixed reference geometry. Presets seed the base recipe and diverged edits become Custom. Default reference opacity and Standard preset opacity are different recipes, not competing applied defaults.

### Geometry and precedence
Use border-box sizing and reserve base border width. Focus uses an external outline, never thicker layout geometry. Disabled/read-only prevents activation; error/warning communicates validation; selected communicates selection; hover/pressed may change tone; keyboard focus remains visible on top of all. Required adds a marker and validation rather than an unexplained border state.

### Semantic defaults
Resting controls use --control-border; structural lines remain --line/--line-strong. Error, Warning, Success and Info resolve to semantic colors unless a state override is explicitly saved. Brand is for active/selected/focus. Include text or an icon for validation; do not make color the only indicator.

### Combined-state examples
Focused error: error boundary and associated message plus an independent brand focus outline. Selected hover: preserve selection marker while adjusting its tone. Loading disabled: aria-busy plus blocked activation and a readable loading label; do not announce each frame. Success focus: success message/indicator plus visible focus. Read-only is focusable and copyable where appropriate, rather than disabled. Show required status in the label and validate on the documented form trigger.

### Widths and exceptions
Approved visual widths are 0,1,1.5,2,3,4px. Custom base widths up to 8px are allowed only as explicit configured exceptions. CSS triangles are geometry and not control boundaries. Native hairlines require the platform adapter and physical-density acceptance; 1 CSS px is not universally one device pixel.

### Accessible and directional behavior
Calculate alpha-composited boundary versus its adjacent surface for 3:1 when essential to identify a control. Focus must remain visible in forced colors. Logical start/end track RTL; physical sides are only for physical geometry. Print uses explicit solid boundaries if shadow/tint disappears.

### Flow and export
Try partial hex and invalid opacity without replacing applied values. Zero width/opacity survives reload. Export effective base recipe, fixed state recipes, color overrides, exceptions, precedence, focus and directional behavior.

### Save and edit
Selections preview immediately. Save foundation commits valid settings in this browser and locks the editor. Select Edit foundation to revise saved settings; Cancel retains the saved settings. Storage failure keeps the draft editable.
Machine contract: section rules, storage, units and acceptance
{
  "schemaVersion": 1,
  "authority": "Saved validated choices override project recommendations, which override system defaults. This implementation contract governs static specimens. Resolved tokens in the current export are authoritative values. Component exceptions must name the affected role and reason.",
  "governance": {
    "owners": "Design System Lead owns token and compatibility policy. Designers own specimens and interaction contracts. Developers own resolver/export/import parity. QA and Accessibility own release evidence. Product teams own domain-specific confidence, privacy and retention policies.",
    "changes": "Change the JSON contract first, regenerate documentation/defaults/catalog/tokens, then run model, DOM and recipient checks. Link the changed finding IDs and evidence in the release review.",
    "compatibility": "Keep hue-named CSS tokens as compatibility aliases while semantic consumers migrate. Additive tokens retain schemaVersion 1. A removed/renamed key or changed stored meaning requires a schema migration, a version bump and a documented replacement before release. Keep the prior reader fixture until the migration is verified.",
    "deprecation": "Record old key, replacement, reason, introduced version, planned removal version and affected consumers. Do not remove a token while an active consumer still uses it. Future records are preserved rather than coerced.",
    "scope": "This is a web design system with one shared workspace profile. Native dp/sp adaptation and real agent execution require separate adapters and acceptance. User-defined colors and responsive exceptions require product-specific rendered verification."
  },
  "storage": {
    "version": 1,
    "legacy": "Unversioned valid records migrate in memory. Typography headingScaleVersion 2 applies the smaller six-heading scale once to older records, retaining other roles and existing font/color/style metrics. Later custom size edits are retained. Unsupported future records are preserved. The next successful write stamps the migrated version.",
    "future": "Reject unsupported future versions. Preserve raw data. Offer backup and explicit reset.",
    "invalid": "Foundation selections preview locally until Save foundation succeeds. Saved Foundation editors require Edit foundation before changes. Cancel discards the preview. Invalid drafts never replace saved records; storage failures retain the editable preview and the last durable record.",
    "concurrency": "A storage event refreshes applied tokens and disables stale editor controls until reload. Never merge simultaneous edits silently."
  },
  "units": {
    "base": "1rem = 16px at default browser settings. Do not fix the root font size.",
    "use": "Prefer rem for typography, spacing and control dimensions. Hairline borders and viewport thresholds may use px. Both equivalents appear in Markdown. SVG strokes use viewBox units. Ratios, percentages, columns, timing and weights are unitless or retain their own units.",
    "native": "Web CSS px/rem are not native dp/sp. A native adapter must map semantic roles, support text scaling and test device density. Native rendering is not shipped by this web library."
  },
  "acceptance": [
    "Compare page, applied tokens, durable record, Machine View and exported instructions.",
    "Test valid, unfinished, invalid, missing, malformed, legacy and future records. Exercise storage failure, reset, reload and another tab.",
    "Test 320, 375, 768, 1024 and 1440px widths, 200% zoom, text-spacing overrides, RTL and long/localized labels.",
    "Use keyboard and screen reader. Confirm focus return, names, values, error associations and status announcements.",
    "Verify actual rendered text/surface pairs, forced colors, reduced motion, print and exported recipes in a recipient fixture. Source or DOM checks alone are not rendered acceptance."
  ],
  "layers": {
    "content": 0,
    "sticky": 20,
    "popover": 40,
    "scrim": 60,
    "dialog": 70,
    "toast": 80,
    "tooltip": 90,
    "rules": "Each overlay gets an explicit owner and close/focus-return path. Portal menus out of clipped scroll containers. Nested dialogs stack one scrim per modal owner. Escape closes the top dismissible layer. Tooltips never block actions. Test collision and zoom; do not infer stacking order from shadow size."
  },
  "section": {
    "title": "Borders",
    "rules": {
      "Editable versus fixed": "Base width, color, opacity, style and sides are editable. State colors are editable; per-state width/opacity/style rows are fixed reference geometry. Presets seed the base recipe and diverged edits become Custom. Default reference opacity and Standard preset opacity are different recipes, not competing applied defaults.",
      "Geometry and precedence": "Use border-box sizing and reserve base border width. Focus uses an external outline, never thicker layout geometry. Disabled/read-only prevents activation; error/warning communicates validation; selected communicates selection; hover/pressed may change tone; keyboard focus remains visible on top of all. Required adds a marker and validation rather than an unexplained border state.",
      "Semantic defaults": "Resting controls use --control-border; structural lines remain --line/--line-strong. Error, Warning, Success and Info resolve to semantic colors unless a state override is explicitly saved. Brand is for active/selected/focus. Include text or an icon for validation; do not make color the only indicator.",
      "Combined-state examples": "Focused error: error boundary and associated message plus an independent brand focus outline. Selected hover: preserve selection marker while adjusting its tone. Loading disabled: aria-busy plus blocked activation and a readable loading label; do not announce each frame. Success focus: success message/indicator plus visible focus. Read-only is focusable and copyable where appropriate, rather than disabled. Show required status in the label and validate on the documented form trigger.",
      "Widths and exceptions": "Approved visual widths are 0,1,1.5,2,3,4px. Custom base widths up to 8px are allowed only as explicit configured exceptions. CSS triangles are geometry and not control boundaries. Native hairlines require the platform adapter and physical-density acceptance; 1 CSS px is not universally one device pixel.",
      "Accessible and directional behavior": "Calculate alpha-composited boundary versus its adjacent surface for 3:1 when essential to identify a control. Focus must remain visible in forced colors. Logical start/end track RTL; physical sides are only for physical geometry. Print uses explicit solid boundaries if shadow/tint disappears.",
      "Flow and export": "Try partial hex and invalid opacity without replacing applied values. Zero width/opacity survives reload. Export effective base recipe, fixed state recipes, color overrides, exceptions, precedence, focus and directional behavior.",
      "Save and edit": "Selections preview immediately. Save foundation commits valid settings in this browser and locks the editor. Select Edit foundation to revise saved settings; Cancel retains the saved settings. Storage failure keeps the draft editable."
    }
  }
}

---

## Breadcrumb

Source: breadcrumb-default.html · Status: Available

Components · Navigation · Breadcrumb
  Back to Breadcrumb types

# Breadcrumb
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
A horizontal trail of navigational links showing the user's current location within a hierarchy, separated by a divider - the last item is always the current page, shown as plain text, not a link.

## Properties

Size and labels are properties of the same component, not separate trails - change them below to check this breadcrumb's style and states in the Live Preview. Item count follows the number of labels entered, and the last label is always the current page.

        Size

        Labels

## Live Preview
    
Both types compared side by side, each in all 5 states - the first link demonstrates the row's state while every other link and the current-page item stay at Rest. One full matrix is rendered per selected Size. Entering more than 4 labels collapses the middle items into a single non-interactive "…" marker, keeping the first item and the last two visible.

## When to use
    
Anywhere a user needs to see and retrace their location within a nested hierarchy.

      Product category trail
      File/folder path
      Documentation hierarchy
      Multi-step form location

## Component Guide

        Human View
        Machine View

Overview
      
Breadcrumb is a horizontal trail of navigational links showing the user's current location within a hierarchy, separated by a divider - the last item is always the current page, shown as plain text rather than a clickable link.

When to Use

- A product category trail - Home / Electronics / Laptops.
        
- A file or folder path - showing nested location within a file browser.
        
- Documentation hierarchy or a multi-step form's current section - anywhere retracing the path back up the hierarchy is useful.

When Not to Use

- A flat structure with no real hierarchy - a breadcrumb implies nested depth; don't add one just to show a page title.
        
- The primary means of navigating the product - Breadcrumb supplements primary navigation (a sidebar, a nav bar) - it shouldn't be the only way to get around.
        
- A sequence of steps the user is moving through, rather than a location in a hierarchy - use Steps instead.

Best Practices

- Keep every item except the last one a real, clickable link, so users can jump back to any ancestor level directly.
        
- Truncate very long trails (many levels deep) with an ellipsis or collapsed middle section rather than wrapping across lines - past 4 levels, show the first level, a collapsed "…" (expandable on click/tap to reveal the hidden middle levels), then the last 2 levels plus the current page.
        
- Match the trail exactly to the real navigational hierarchy - a breadcrumb that lies about structure erodes trust in it.

Do and Don't

Do

Projects›Q1 Launch›Budget
          
Every ancestor is a real link back up the hierarchy; only the current page is plain text, since it has nowhere further to go.

Don't

Projects›Q1 Launch›Budget
          
When every crumb is unclickable text, the trail can only be read, not used - the user still has to find another way back to Projects.

Accessibility

- Wrapped in a nav landmark with an accessible name ("Breadcrumb"), so it's easy to jump to for screen-reader users.
        
- The current page (last item) is marked with aria-current="page" rather than just styled differently.
        
- Dividers between items are decorative and hidden from assistive technology (aria-hidden), so the trail reads cleanly as a list of links.

Related Components
      
Anchor, Tabs, Steps.

{
  "component": "Breadcrumb",
  "category": "Navigation",
  "summary": "Breadcrumb is a horizontal trail of navigational links showing the user's current location within a hierarchy, separated by a divider - the last item is always the current page, shown as plain text rather than a clickable link.",
  "whenToUse": [
    "A product category trail - Home / Electronics / Laptops.",
    "A file or folder path - showing nested location within a file browser.",
    "Documentation hierarchy or a multi-step form's current section - anywhere retracing the path back up the hierarchy is useful."
  ],
  "whenNotToUse": [
    "A flat structure with no real hierarchy - a breadcrumb implies nested depth; don't add one just to show a page title.",
    "The primary means of navigating the product - Breadcrumb supplements primary navigation (a sidebar, a nav bar) - it shouldn't be the only way to get around.",
    "A sequence of steps the user is moving through, rather than a location in a hierarchy - use Steps instead."
  ],
  "bestPractices": [
    "Keep every item except the last one a real, clickable link, so users can jump back to any ancestor level directly.",
    "Truncate very long trails (many levels deep) with an ellipsis or collapsed middle section rather than wrapping across lines.",
    "Match the trail exactly to the real navigational hierarchy - a breadcrumb that lies about structure erodes trust in it."
  ],
  "doAndDont": {
    "do": "Every ancestor is a real link back up the hierarchy; only the current page is plain text, since it has nowhere further to go.",
    "dont": "When every crumb is unclickable text, the trail can only be read, not used - the user still has to find another way back to Projects."
  },
  "accessibility": [
    "Wrapped in a nav landmark with an accessible name (\"Breadcrumb\"), so it's easy to jump to for screen-reader users.",
    "The current page (last item) is marked with aria-current=\"page\" rather than just styled differently.",
    "Dividers between items are decorative and hidden from assistive technology (aria-hidden), so the trail reads cleanly as a list of links."
  ],
  "relatedComponents": [
    "Anchor",
    "Tabs",
    "Steps"
  ]
}

---

## Breadcrumb

Source: breadcrumb.html · Status: Available

Components · Navigation

# Breadcrumb
  
A horizontal trail of navigational links showing the user's current location within a hierarchy, separated by a divider, with the last item always the current page.

## Breadcrumb type

Copy a ready-to-paste AI prompt or the working code - both use this system's own color tokens and Inter, never arbitrary values. Click the card to configure it in full.

Breadcrumb

          Copy prompt

---

## Destructive Button

Source: button-destructive.html · Status: Available

Components · Actions · Button
  Back to Button types

# Destructive Button
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
Use for actions that can cause data loss or other irreversible consequences.

## Properties

Size, content, corner radius and label are properties of the button component, not separate buttons - change them below to check this button's style, variation and states in the Live Preview.

        Size

        Content

        Corner radius

        Button label

        Accessible label (required for icon-only)?

## Live Preview
    
All 8 types compared side by side, each in all 6 states. One full matrix is rendered per selected combination of Size, Content and Corner radius - check more than one option in a dropdown to see every combination side by side.

## When to use Destructive
    
An action with irreversible consequences, like deleting a record or discarding unsaved work.

      Delete
      Remove
      Terminate
      Cancel Subscription
      Reset
      Discard

## Component Guide

        Human View
        Machine View

Overview
      
Destructive Button is a deliberately alarming, danger-colored button reserved for actions that cause irreversible consequences - deleting a record, discarding unsaved work, or canceling a subscription. Its color is the first and fastest signal a user gets that the action can't be easily undone.

When to Use

- Deleting or permanently removing data - Delete, Remove, Terminate.
        
- Actions that discard the user's own work - Discard changes, Reset a form.
        
- Canceling something with real consequences - Cancel Subscription, Revoke access.

When Not to Use

- Any action that is easily reversible - use Primary or Secondary instead - reserving red for real danger keeps it meaningful.
        
- As a generic "important" button - Destructive communicates risk, not priority; a merely important-but-safe action should stay Primary.
        
- Multiple destructive actions competing in the same view - surface only the one the user is actually about to take, typically behind a confirmation step.

Best Practices

- Pair it with an explicit confirmation step (a Modal or Pop Confirm) for anything truly irreversible, rather than firing on a single click.
        
- Use a specific verb, not a bare "Yes" - "Delete project" communicates the consequence, "Yes" does not.
        
- Never use Destructive styling for a safe action just to make it stand out - it trains users to distrust the color's warning.

Do and Don't

Do
          
CancelDelete project
          
Paired with an easy way out, and used only for the one action that actually destroys something.

Don't
          
Log out
          
Logging out is reversible in one click. Reserving red for genuinely destructive actions is what makes it trustworthy when it does appear.

Accessibility

- Never rely on color alone to communicate danger - the label text itself should name the consequence (Delete, not just a trash icon).
        
- Same native <button> keyboard and focus behavior as every other type, with a visible focus ring in the danger color.
        
- When paired with a confirmation dialog, focus should move into that dialog so keyboard and screen-reader users aren't left on the original trigger.

Related Components
      
Primary Button, Modal (for a confirmation step), Pop Confirm (for a lightweight inline confirmation).

{
  "component": "Button",
  "type": "Destructive",
  "category": "Actions",
  "summary": "Destructive Button is a deliberately alarming, danger-colored button reserved for actions that cause irreversible consequences - deleting a record, discarding unsaved work, or canceling a subscription. Its color is the first and fastest signal a user gets that the action can't be easily undone.",
  "whenToUse": [
    "Deleting or permanently removing data - Delete, Remove, Terminate.",
    "Actions that discard the user's own work - Discard changes, Reset a form.",
    "Canceling something with real consequences - Cancel Subscription, Revoke access."
  ],
  "whenNotToUse": [
    "Any action that is easily reversible - use Primary or Secondary instead - reserving red for real danger keeps it meaningful.",
    "As a generic \"important\" button - Destructive communicates risk, not priority; a merely important-but-safe action should stay Primary.",
    "Multiple destructive actions competing in the same view - surface only the one the user is actually about to take, typically behind a confirmation step."
  ],
  "bestPractices": [
    "Pair it with an explicit confirmation step (a Modal or Pop Confirm) for anything truly irreversible, rather than firing on a single click.",
    "Use a specific verb, not a bare \"Yes\" - \"Delete project\" communicates the consequence, \"Yes\" does not.",
    "Never use Destructive styling for a safe action just to make it stand out - it trains users to distrust the color's warning."
  ],
  "doAndDont": {
    "do": "Paired with an easy way out, and used only for the one action that actually destroys something.",
    "dont": "Logging out is reversible in one click. Reserving red for genuinely destructive actions is what makes it trustworthy when it does appear."
  },
  "accessibility": [
    "Never rely on color alone to communicate danger - the label text itself should name the consequence (Delete, not just a trash icon).",
    "Same native <button> keyboard and focus behavior as every other type, with a visible focus ring in the danger color.",
    "When paired with a confirmation dialog, focus should move into that dialog so keyboard and screen-reader users aren't left on the original trigger."
  ],
  "relatedComponents": [
    "Primary Button",
    "Modal",
    "Pop Confirm"
  ]
}

---

## Ghost Button

Source: button-ghost.html · Status: Available

Components · Actions · Button
  Back to Button types

# Ghost Button
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
Use where the interface already provides enough visual structure that the button doesn't need its own.

## Properties

Size, content, corner radius and label are properties of the button component, not separate buttons - change them below to check this button's style, variation and states in the Live Preview.

        Size

        Content

        Corner radius

        Button label

        Accessible label (required for icon-only)?

## Live Preview
    
All 8 types compared side by side, each in all 6 states. One full matrix is rendered per selected combination of Size, Content and Corner radius - check more than one option in a dropdown to see every combination side by side.

## When to use Ghost
    
An action placed inside toolbars, cards, or dense layouts where a bordered button would add unnecessary weight, like closing or dismissing something.

      Close
      Dismiss
      Expand
      More
      Toolbar actions

## Component Guide

        Human View
        Machine View

Overview
      
Ghost Button has no fill and no border at rest, only a background or color change on hover or focus - built for toolbars, cards, and dense layouts that already provide their own visual structure, so the button doesn't need one of its own.

When to Use

- Toolbar and icon-adjacent actions - close, dismiss, expand/collapse controls.
        
- Actions inside an already-bordered container - a card, a table row, a panel header - where a second border would be redundant.
        
- Repeated per-item actions - row-level actions in a list or table where many buttons appear at once.

When Not to Use

- A screen's main or only call to action - use Primary - Ghost is built to blend in, which works against being noticed.
        
- Anywhere the action needs to be found at a glance - use Secondary or Tertiary if some visual weight is still needed.
        
- A standalone destructive action with no surrounding context - pair Ghost with Destructive styling only when the container already makes the risk clear.

Best Practices

- Use it inside layouts that already have visual containment (cards, toolbars, table rows) rather than as a floating standalone control.
        
- Always keep a visible hover/focus background change, since the rest state is intentionally blank.
        
- Pair with an icon when the label alone would be too subtle to notice.

Do and Don't

Do
          
✕
          
An icon-only dismiss action on a light or media background, where a filled button would fight the content behind it.

Don't
          
GhostGhostGhost
          
A whole row of Ghost buttons on a plain background has almost no contrast to separate one target from the next - the row reads as one smear rather than three choices.

Accessibility

- Hover and focus states must supply a real background or outline change - a Ghost button relying on color-only text change fails WCAG 2.2's non-text contrast guidance.
        
- Still a native <button> element, fully keyboard operable.
        
- Icon-only Ghost buttons need an accessible label (aria-label or visually hidden text), since there is no visible text to announce.

Related Components
      
Tertiary Button (low emphasis with text), Float Button (a persistent icon-only corner action), Dropdown (a trigger frequently styled Ghost inside toolbars).

{
  "component": "Button",
  "type": "Ghost",
  "category": "Actions",
  "summary": "Ghost Button has no fill and no border at rest, only a background or color change on hover or focus - built for toolbars, cards, and dense layouts that already provide their own visual structure, so the button doesn't need one of its own.",
  "whenToUse": [
    "Toolbar and icon-adjacent actions - close, dismiss, expand/collapse controls.",
    "Actions inside an already-bordered container - a card, a table row, a panel header - where a second border would be redundant.",
    "Repeated per-item actions - row-level actions in a list or table where many buttons appear at once."
  ],
  "whenNotToUse": [
    "A screen's main or only call to action - use Primary - Ghost is built to blend in, which works against being noticed.",
    "Anywhere the action needs to be found at a glance - use Secondary or Tertiary if some visual weight is still needed.",
    "A standalone destructive action with no surrounding context - pair Ghost with Destructive styling only when the container already makes the risk clear."
  ],
  "bestPractices": [
    "Use it inside layouts that already have visual containment (cards, toolbars, table rows) rather than as a floating standalone control.",
    "Always keep a visible hover/focus background change, since the rest state is intentionally blank.",
    "Pair with an icon when the label alone would be too subtle to notice."
  ],
  "doAndDont": {
    "do": "An icon-only dismiss action on a light or media background, where a filled button would fight the content behind it.",
    "dont": "A whole row of Ghost buttons on a plain background has almost no contrast to separate one target from the next - the row reads as one smear rather than three choices."
  },
  "accessibility": [
    "Hover and focus states must supply a real background or outline change - a Ghost button relying on color-only text change fails WCAG 2.2's non-text contrast guidance.",
    "Still a native <button> element, fully keyboard operable.",
    "Icon-only Ghost buttons need an accessible label (aria-label or visually hidden text), since there is no visible text to announce."
  ],
  "relatedComponents": [
    "Tertiary Button",
    "Float Button",
    "Dropdown"
  ]
}

---

## Link Button

Source: button-link.html · Status: Available

Components · Actions · Button
  Back to Button types

# Link Button
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
Use for navigation-like actions that behave visually like a link, not a boxed action.

## Properties

Size, content, corner radius and label are properties of the button component, not separate buttons - change them below to check this button's style, variation and states in the Live Preview.

        Size

        Content

        Corner radius

        Button label

        Accessible label (required for icon-only)?

## Live Preview
    
All 8 types compared side by side, each in all 6 states. One full matrix is rendered per selected combination of Size, Content and Corner radius - check more than one option in a dropdown to see every combination side by side.

## When to use Link
    
A navigation-style action that behaves like a hyperlink rather than a boxed command, like viewing details or opening a page.

      View Details
      Learn More
      View All
      Go to Dashboard

## Component Guide

        Human View
        Machine View

Overview
      
Link-type Button reads visually like a hyperlink - no box, no fill, just colored text - but behaves and is marked up as a button-style action rather than a real navigational link. It sits between Anchor (plain inline text for wayfinding) and a boxed button (a clear call to action).

When to Use

- Navigation-style actions inside button groups or toolbars - View Details, Learn More, View All.
        
- Actions that feel like "going somewhere" rather than "doing something" - Go to Dashboard.
        
- Contexts where a boxed button would look too heavy but the action still needs to sit among other buttons - a card footer's row of actions.

When Not to Use

- Plain inline text links inside a paragraph or list - use Anchor instead - it's built for exactly that case and is semantically a link, not a button.
        
- The primary action of a form or flow - use Primary - a Link-styled button under-communicates urgency.
        
- Irreversible or high-stakes actions - always use a boxed Destructive button so risk is visually obvious.

Best Practices

- Reserve the Link type for actions living among other buttons, not for body copy - use Anchor there instead.
        
- Give it an underline on hover/focus so it still reads as interactive despite having no box.
        
- Avoid placing more than one Link-styled button in the same row as a Primary button - it can visually compete despite its low weight.

Do and Don't

Do
          
Read the full changelog for details.
          
Inline, inside a sentence, taking the reader somewhere - what a link is for.

Don't
          
Delete workspace
          
A destructive action styled as a Link looks like the least important thing on the page, which is the opposite of what a high-consequence action should signal.

Accessibility

- Still a real <button> element, not an <a> - screen readers announce it as a button, matching its actual behavior (no href, no navigation).
        
- Underline or color change on focus, never color alone, to signal keyboard focus.
        
- Text color meets WCAG 2.2 AA contrast against the surrounding background in both themes.

Related Components
      
Anchor (the plain-text equivalent for inline copy), Tertiary Button, Ghost Button, Dropdown.

{
  "component": "Button",
  "type": "Link",
  "category": "Actions",
  "summary": "Link-type Button reads visually like a hyperlink - no box, no fill, just colored text - but behaves and is marked up as a button-style action rather than a real navigational link. It sits between Anchor (plain inline text for wayfinding) and a boxed button (a clear call to action).",
  "whenToUse": [
    "Navigation-style actions inside button groups or toolbars - View Details, Learn More, View All.",
    "Actions that feel like \"going somewhere\" rather than \"doing something\" - Go to Dashboard.",
    "Contexts where a boxed button would look too heavy but the action still needs to sit among other buttons - a card footer's row of actions."
  ],
  "whenNotToUse": [
    "Plain inline text links inside a paragraph or list - use Anchor instead - it's built for exactly that case and is semantically a link, not a button.",
    "The primary action of a form or flow - use Primary - a Link-styled button under-communicates urgency.",
    "Irreversible or high-stakes actions - always use a boxed Destructive button so risk is visually obvious."
  ],
  "bestPractices": [
    "Reserve the Link type for actions living among other buttons, not for body copy - use Anchor there instead.",
    "Give it an underline on hover/focus so it still reads as interactive despite having no box.",
    "Avoid placing more than one Link-styled button in the same row as a Primary button - it can visually compete despite its low weight."
  ],
  "doAndDont": {
    "do": "Inline, inside a sentence, taking the reader somewhere - what a link is for.",
    "dont": "A destructive action styled as a Link looks like the least important thing on the page, which is the opposite of what a high-consequence action should signal."
  },
  "accessibility": [
    "Still a real <button> element, not an <a> - screen readers announce it as a button, matching its actual behavior (no href, no navigation).",
    "Underline or color change on focus, never color alone, to signal keyboard focus.",
    "Text color meets WCAG 2.2 AA contrast against the surrounding background in both themes."
  ],
  "relatedComponents": [
    "Anchor",
    "Tertiary Button",
    "Ghost Button",
    "Dropdown"
  ]
}

---

## Neutral Button

Source: button-neutral.html · Status: Available

Components · Actions · Button
  Back to Button types

# Neutral Button
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
Use when the action needs clear affordance without strong brand emphasis.

## Properties

Size, content, corner radius and label are properties of the button component, not separate buttons - change them below to check this button's style, variation and states in the Live Preview.

        Size

        Content

        Corner radius

        Button label

        Accessible label (required for icon-only)?

## Live Preview
    
All 8 types compared side by side, each in all 6 states. One full matrix is rendered per selected combination of Size, Content and Corner radius - check more than one option in a dropdown to see every combination side by side.

## When to use Neutral
    
A utility action that needs clear affordance without strong brand emphasis, like filtering, sorting, or adjusting options.

      Filter
      Sort
      Options
      Settings

## Component Guide

        Human View
        Machine View

Overview
      
Neutral Button gives a utility action clear, bordered affordance without borrowing the brand's red accent - used for actions that need to look clickable but shouldn't carry any semantic weight (success, danger, or primary emphasis).

When to Use

- Utility and configuration actions - Filter, Sort, Options, Settings.
        
- Toolbars where several buttons sit side by side and none should dominate - a filter bar above a table.
        
- Anywhere a bordered, clearly-clickable control is needed but the action carries no urgency or risk - toggling a view mode.

When Not to Use

- The main call to action - use Primary - Neutral is intentionally low on visual priority.
        
- Destructive or risky actions - use Destructive so the red accent communicates danger, which Neutral deliberately avoids.
        
- Actions meant to visually pair with a Primary button as its direct alternate - use Secondary, which is designed for that exact pairing.

Best Practices

- Use it for genuinely neutral, non-branded utility actions - filtering, sorting, view toggles - not as a generic substitute for Secondary.
        
- Keep its border weight and color consistent with other Neutral buttons so "gray bordered button" reliably means "utility action" across the product.
        
- Pair with a small icon (filter, sort arrows) when the action benefits from an at-a-glance cue.

Do and Don't

Do
          
FilterSort
          
Toolbar actions of equal, unremarkable weight, where nothing should be pulling focus from the content below.

Don't
          
Submit application
          
The one action that ends the flow, styled with no more weight than a toolbar icon, is easy to miss entirely.

Accessibility

- Border and label meet WCAG 2.2 AA contrast in both themes despite the deliberately muted palette.
        
- Native <button> semantics, full keyboard support, visible focus outline.
        
- Disabled state uses the native disabled attribute so assistive tech announces it as unavailable, not just visually dimmed.

Related Components
      
Secondary Button, Tertiary Button, Group Button (for switching between a small set of neutral options).

{
  "component": "Button",
  "type": "Neutral",
  "category": "Actions",
  "summary": "Neutral Button gives a utility action clear, bordered affordance without borrowing the brand's red accent - used for actions that need to look clickable but shouldn't carry any semantic weight (success, danger, or primary emphasis).",
  "whenToUse": [
    "Utility and configuration actions - Filter, Sort, Options, Settings.",
    "Toolbars where several buttons sit side by side and none should dominate - a filter bar above a table.",
    "Anywhere a bordered, clearly-clickable control is needed but the action carries no urgency or risk - toggling a view mode."
  ],
  "whenNotToUse": [
    "The main call to action - use Primary - Neutral is intentionally low on visual priority.",
    "Destructive or risky actions - use Destructive so the red accent communicates danger, which Neutral deliberately avoids.",
    "Actions meant to visually pair with a Primary button as its direct alternate - use Secondary, which is designed for that exact pairing."
  ],
  "bestPractices": [
    "Use it for genuinely neutral, non-branded utility actions - filtering, sorting, view toggles - not as a generic substitute for Secondary.",
    "Keep its border weight and color consistent with other Neutral buttons so \"gray bordered button\" reliably means \"utility action\" across the product.",
    "Pair with a small icon (filter, sort arrows) when the action benefits from an at-a-glance cue."
  ],
  "doAndDont": {
    "do": "Toolbar actions of equal, unremarkable weight, where nothing should be pulling focus from the content below.",
    "dont": "The one action that ends the flow, styled with no more weight than a toolbar icon, is easy to miss entirely."
  },
  "accessibility": [
    "Border and label meet WCAG 2.2 AA contrast in both themes despite the deliberately muted palette.",
    "Native <button> semantics, full keyboard support, visible focus outline.",
    "Disabled state uses the native disabled attribute so assistive tech announces it as unavailable, not just visually dimmed."
  ],
  "relatedComponents": [
    "Secondary Button",
    "Tertiary Button",
    "Group Button"
  ]
}

---

## Primary Button 36px - Dual Icon

Source: button-primary-icon.html · Status: Available

Components · Actions · Button
  Back to Button types

# Primary Button 36px - Dual Icon
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
A filled, high-emphasis dual-icon action button.

## Properties

Size, corner radius, content and label apply to all 8 columns below, including the CTA With Dropdown - they are properties of one shared panel, not separate buttons. 36px / 4px radius is the spec default. "CTA leading icon" is the one exception: it only shows or hides the chevron icon on the CTA With Dropdown's main action and has no effect on the other 7 types.

        Size

        Corner radius

        Content

        Label

        CTA leading icon

          dropdown column only

## Live Preview
    
All 7 types plus the CTA With Dropdown compared side by side, each in all 6 states, arranged with Rest first. One full matrix is rendered per selected combination of Size, Corner radius and Content - check more than one option in a dropdown to see every combination side by side.

## When to use Primary
    
The button that carries the main call to action on a screen, like saving a form, submitting a purchase, or confirming a change.

      Save
      Create
      Submit
      Continue
      Confirm

## Component Guide

        Human View
        Machine View

Overview
      
The Dual Icon Button is a compact, filled, high-emphasis action button built for a leading icon, a label, and an optional trailing icon together - used when a primary action benefits from an icon cue alongside its text, at a fixed 36px height distinct from the standard Button's size scale.

When to Use

- A primary action that benefits from a recognizable icon alongside its label - a branded save/continue action tied to a specific integration or provider.
        
- Compact toolbars or headers - where a fixed 36px control fits the surrounding density better than the standard Button size scale.
        
- Uploading and managing custom icon variations for the same action across contexts - via the page's own icon-upload control.

When Not to Use

- A plain text-only primary action - use the standard Primary Button - the dual-icon layout adds visual weight that a simple action doesn't need.
        
- Low-emphasis or supporting actions - use Secondary, Tertiary, or Ghost - Dual Icon is a high-emphasis, filled variant only.
        
- Icon-only actions with no label at all - use Float Button or an icon-only Ghost/Tertiary button instead.

Best Practices

- Only add a trailing icon when it conveys real information (e.g. an external-link cue) - don't add one purely for symmetry.
        
- Keep uploaded custom icons visually consistent in weight and size with the built-in icon set.
        
- Use this fixed 36px size deliberately for the specific contexts it's designed for, rather than mixing it freely with the standard Button size scale.

Do and Don't

Do
          
✓ Save changes
          
An icon that reinforces a label already stating the action in words.

Don't

A single unlabelled glyph for an action with no universal symbol forces the user to guess or hover-and-wait. Pair icon-only buttons with a Tooltip, or keep the label.

Accessibility

- Icons are decorative alongside a visible text label, so they're marked aria-hidden while the label carries the accessible name.
        
- Same native <button> semantics and visible focus outline as every other Button type.
        
- Custom-uploaded icons should maintain sufficient contrast against the button's fill color.

Related Components
      
Primary Button, Secondary Button, Float Button (icon-only corner action), Upload (for managing the icon files themselves).

{
  "component": "Button",
  "type": "Primary Icon (Dual Icon)",
  "category": "Actions",
  "summary": "The Dual Icon Button is a compact, filled, high-emphasis action button built for a leading icon, a label, and an optional trailing icon together - used when a primary action benefits from an icon cue alongside its text, at a fixed 36px height distinct from the standard Button's size scale.",
  "whenToUse": [
    "A primary action that benefits from a recognizable icon alongside its label - a branded save/continue action tied to a specific integration or provider.",
    "Compact toolbars or headers - where a fixed 36px control fits the surrounding density better than the standard Button size scale.",
    "Uploading and managing custom icon variations for the same action across contexts - via the page's own icon-upload control."
  ],
  "whenNotToUse": [
    "A plain text-only primary action - use the standard Primary Button - the dual-icon layout adds visual weight that a simple action doesn't need.",
    "Low-emphasis or supporting actions - use Secondary, Tertiary, or Ghost - Dual Icon is a high-emphasis, filled variant only.",
    "Icon-only actions with no label at all - use Float Button or an icon-only Ghost/Tertiary button instead."
  ],
  "bestPractices": [
    "Only add a trailing icon when it conveys real information (e.g. an external-link cue) - don't add one purely for symmetry.",
    "Keep uploaded custom icons visually consistent in weight and size with the built-in icon set.",
    "Use this fixed 36px size deliberately for the specific contexts it's designed for, rather than mixing it freely with the standard Button size scale."
  ],
  "doAndDont": {
    "do": "An icon that reinforces a label already stating the action in words.",
    "dont": "A single unlabelled glyph for an action with no universal symbol forces the user to guess or hover-and-wait. Pair icon-only buttons with a Tooltip, or keep the label."
  },
  "accessibility": [
    "Icons are decorative alongside a visible text label, so they're marked aria-hidden while the label carries the accessible name.",
    "Same native <button> semantics and visible focus outline as every other Button type.",
    "Custom-uploaded icons should maintain sufficient contrast against the button's fill color."
  ],
  "relatedComponents": [
    "Primary Button",
    "Secondary Button",
    "Float Button",
    "Upload"
  ]
}

---

## Primary Button

Source: button-primary.html · Status: Available

Components · Actions · Button
  Back to Button types

# Primary Button
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
Use for the single most important action on a screen.

## Properties

Size, content, corner radius and label are properties of the button component, not separate buttons - change them below to check this button's style, variation and states in the Live Preview.

        Size

        Content

        Corner radius

        Button label

        Accessible label (required for icon-only)?

## Live Preview
    
All 8 types compared side by side, each in all 6 states. One full matrix is rendered per selected combination of Size, Content and Corner radius - check more than one option in a dropdown to see every combination side by side.

## When to use Primary
    
The button that carries the main call to action on a screen, like saving a form, submitting a purchase, or confirming a change.

      Save
      Create
      Submit
      Continue
      Buy Now
      Confirm
      Start
      Generate

## Component Guide

        Human View
        Machine View

Overview
      
The Primary Button is the highest-emphasis action in the Agentic Design System - a solid, brand-red filled button reserved for the single most important action on a screen or within a section. Its strong fill and contrast are what make it read as "the one thing to do here," so its impact depends on staying rare: a screen with more than one Primary Button no longer tells the user where to look first.

When to Use

- The main call to action on a form or page - Save, Submit, Continue, Buy Now.
        
- The action that completes or advances a flow - Create, Generate, Start, Confirm.
        
- Exactly one per screen or logical section - a modal footer, a form, a card - never two Primary Buttons competing in the same view.
        
- Paired with a Secondary Button for the alternate action - e.g. "Save" (Primary) next to "Cancel" (Secondary).

When Not to Use

- Supporting or optional actions - use Secondary or Tertiary instead, so the visual hierarchy still points at the real primary action.
        
- Irreversible or data-loss actions - use the Destructive type so risk is communicated by color, not just position.
        
- Plain navigation or wayfinding - use Anchor (inline text link) or Link-type Button instead of a boxed, high-emphasis button.
        
- Repeated per-row actions in a table or list - a Primary Button repeated many times in a view dilutes its meaning; use Ghost or Tertiary for row-level actions.

Best Practices

- Keep the label a specific verb or verb phrase ("Save changes", not "OK" or "Submit" in isolation) so the action is unambiguous out of context.
        
- Place it in a predictable, consistent position (e.g. bottom-right of a modal/form footer) so users build muscle memory across the product.
        
- Never rely on color alone to convey the Disabled state - it also loses interactivity (cursor, pointer-events) and drops opacity.
        
- Don't change a Primary Button's color per screen to "match a theme" - the brand-red fill is what signals primacy; recoloring it breaks that signal everywhere else it's used correctly.

Do and Don't

Do
          
Save changesCancel
          
One Primary carrying the main action, paired with a Secondary for the alternative. The eye lands on the important one immediately.

Don't
          
SaveExportShare
          
Three Primaries compete, so none of them reads as primary. Once everything is emphasised, nothing is.

Accessibility

- Renders as a real <button> element, so it's reachable by keyboard (Tab) and activates with Enter/Space by default - no extra ARIA role needed.
        
- Focus state uses a visible 2px outline, never a color-only change, so keyboard users can always tell which control is focused.
        
- Text and icon colors meet WCAG 2.2 AA contrast against the red fill in both light and dark theme.
        
- Disabled buttons use the native disabled attribute (removed from the tab order and announced as unavailable by screen readers), not just a visual dim.
        
- Minimum touch target is 40px (Medium size) or larger, meeting WCAG 2.2's target-size guidance for pointer input.

Related Components
      
Secondary Button (the paired alternate action), Tertiary Button and Ghost Button (lower-emphasis actions), Link Button and Anchor (text-only navigation), Destructive Button (irreversible actions), Group Button (mutually exclusive option sets), Float Button (a persistent corner-anchored action).

{
  "component": "Button",
  "type": "Primary",
  "category": "Actions",
  "summary": "The highest-emphasis action button - a solid brand-red fill reserved for the single most important action on a screen or section.",
  "whenToUse": [
    "The main call to action on a form or page (Save, Submit, Continue, Buy Now)",
    "The action that completes or advances a flow (Create, Generate, Start, Confirm)",
    "Exactly one per screen or logical section",
    "Paired with a Secondary Button for the alternate action"
  ],
  "whenNotToUse": [
    "Supporting or optional actions - use Secondary or Tertiary",
    "Irreversible or data-loss actions - use the Destructive type",
    "Plain navigation or wayfinding - use Anchor or the Link type",
    "Repeated per-row actions in a table or list - use Ghost or Tertiary"
  ],
  "bestPractices": [
    "Use a specific verb label, not a generic \"OK\"",
    "Place it in a consistent, predictable position (e.g. bottom-right of a footer)",
    "Never rely on color alone for the Disabled state",
    "Do not recolor it per screen - the brand-red fill is the primacy signal"
  ],
  "doAndDont": {
    "do": "One Primary carrying the main action, paired with a Secondary for the alternative. The eye lands on the important one immediately.",
    "dont": "Three Primaries compete, so none of them reads as primary. Once everything is emphasised, nothing is."
  },
  "accessibility": [
    "Renders as a native <button> element - keyboard reachable and Enter/Space activatable by default",
    "Visible 2px focus outline, never a color-only focus change",
    "Text/icon contrast meets WCAG 2.2 AA against the fill in both themes",
    "Disabled state uses the native disabled attribute, removed from the tab order",
    "Minimum 40px touch target at Medium size, meeting WCAG 2.2 target-size guidance"
  ],
  "relatedComponents": ["Secondary Button", "Tertiary Button", "Ghost Button", "Link Button", "Anchor", "Destructive Button", "Group Button", "Float Button"]
}

---

## Secondary Button

Source: button-secondary.html · Status: Available

Components · Actions · Button
  Back to Button types

# Secondary Button
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
Use for important but supporting actions alongside a Primary button.

## Properties

Size, content, corner radius and label are properties of the button component, not separate buttons - change them below to check this button's style, variation and states in the Live Preview.

        Size

        Content

        Corner radius

        Button label

        Accessible label (required for icon-only)?

## Live Preview
    
All 8 types compared side by side, each in all 6 states. One full matrix is rendered per selected combination of Size, Content and Corner radius - check more than one option in a dropdown to see every combination side by side.

## When to use Secondary
    
A supporting action that sits alongside a Primary button, like canceling, going back, or exporting.

      Cancel
      Back
      Preview
      Edit
      View Details
      Export

## Component Guide

        Human View
        Machine View

Overview
      
Secondary Button is the supporting-action counterpart to Primary - an outlined, unfilled button used for the alternate or less urgent action in the same view, most often placed directly beside a Primary Button.

When to Use

- The alternate action next to a Primary Button - Cancel beside Save, Back beside Continue.
        
- Actions that matter but aren't the main goal of the screen - Preview, Edit, Export, View Details.
        
- Anywhere a bordered, medium-emphasis button reads better than a full fill - toolbars, card footers, dialog footers.

When Not to Use

- The single most important action on the screen - use Primary instead, so there is still exactly one highest-emphasis control.
        
- Irreversible actions - use Destructive so danger is communicated by color as well as position.
        
- Dense, repeated row actions - use Ghost or Tertiary, since Secondary's border still carries meaningful visual weight at scale.

Best Practices

- Pair it with a Primary Button rather than using it alone as a screen's only action.
        
- Keep its border and label weight consistent everywhere it's the "other" choice, so users learn what a bordered button means across the product.
        
- Avoid placing two Secondary buttons side by side for genuinely different actions - if neither is more important, consider Tertiary or Ghost instead.

Do and Don't

Do
          
PublishSave draft
          
Secondary sits beside one Primary, offering a real alternative without competing for the first glance.

Don't
          
Delete account
          
A Secondary carrying a destructive, high-stakes action undersells its own consequence. Give it Destructive's weight instead.

Accessibility

- Same native <button> semantics as Primary - keyboard reachable, Enter/Space activates it.
        
- Border and text color meet WCAG 2.2 AA contrast against the panel background in both themes.
        
- Focus ring is a visible 2px outline, independent of hover styling.

Related Components
      
Primary Button (the paired main action), Tertiary Button and Ghost Button (lower emphasis), Destructive Button (irreversible actions), Group Button.

{
  "component": "Button",
  "type": "Secondary",
  "category": "Actions",
  "summary": "Secondary Button is the supporting-action counterpart to Primary - an outlined, unfilled button used for the alternate or less urgent action in the same view, most often placed directly beside a Primary Button.",
  "whenToUse": [
    "The alternate action next to a Primary Button - Cancel beside Save, Back beside Continue.",
    "Actions that matter but aren't the main goal of the screen - Preview, Edit, Export, View Details.",
    "Anywhere a bordered, medium-emphasis button reads better than a full fill - toolbars, card footers, dialog footers."
  ],
  "whenNotToUse": [
    "The single most important action on the screen - use Primary instead, so there is still exactly one highest-emphasis control.",
    "Irreversible actions - use Destructive so danger is communicated by color as well as position.",
    "Dense, repeated row actions - use Ghost or Tertiary, since Secondary's border still carries meaningful visual weight at scale."
  ],
  "bestPractices": [
    "Pair it with a Primary Button rather than using it alone as a screen's only action.",
    "Keep its border and label weight consistent everywhere it's the \"other\" choice, so users learn what a bordered button means across the product.",
    "Avoid placing two Secondary buttons side by side for genuinely different actions - if neither is more important, consider Tertiary or Ghost instead."
  ],
  "doAndDont": {
    "do": "Secondary sits beside one Primary, offering a real alternative without competing for the first glance.",
    "dont": "A Secondary carrying a destructive, high-stakes action undersells its own consequence. Give it Destructive's weight instead."
  },
  "accessibility": [
    "Same native <button> semantics as Primary - keyboard reachable, Enter/Space activates it.",
    "Border and text color meet WCAG 2.2 AA contrast against the panel background in both themes.",
    "Focus ring is a visible 2px outline, independent of hover styling."
  ],
  "relatedComponents": [
    "Primary Button",
    "Tertiary Button",
    "Ghost Button",
    "Destructive Button",
    "Group Button"
  ]
}

---

## Tertiary Button

Source: button-tertiary.html · Status: Available

Components · Actions · Button
  Back to Button types

# Tertiary Button
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
Use for lower-emphasis actions that shouldn't compete with Primary or Secondary.

## Properties

Size, content, corner radius and label are properties of the button component, not separate buttons - change them below to check this button's style, variation and states in the Live Preview.

        Size

        Content

        Corner radius

        Button label

        Accessible label (required for icon-only)?

## Live Preview
    
All 8 types compared side by side, each in all 6 states. One full matrix is rendered per selected combination of Size, Content and Corner radius - check more than one option in a dropdown to see every combination side by side.

## When to use Tertiary
    
A lower-emphasis action that doesn't need to compete for attention, like learning more or skipping a step.

      Learn More
      View More
      Skip
      Advanced Settings

## Component Guide

        Human View
        Machine View

Overview
      
Tertiary Button is the lowest-emphasis boxed action in the system - text-only styling with no fill and no border at rest, used for actions that should be available but never compete visually with Primary or Secondary.

When to Use

- Low-priority actions alongside higher-emphasis buttons - Learn More, Skip, View More.
        
- Secondary navigation inside a flow - Advanced Settings, a link to an optional step.
        
- Repeated actions in a dense layout - where even Secondary's border would add too much visual noise.

When Not to Use

- The main or supporting action of a screen - use Primary or Secondary so the hierarchy stays legible.
        
- Irreversible actions - always use Destructive, regardless of how minor the action seems.
        
- Anywhere the action needs strong discoverability - a Tertiary button can be easy to miss; use Secondary if visibility matters.

Best Practices

- Reserve it for genuinely optional or low-stakes actions, not as a default fallback for anything without a clear priority.
        
- Still give it a real hit target and visible focus ring even though it has no border at rest.
        
- Avoid using more than one or two Tertiary buttons in the same row - it starts to read as a wall of plain text otherwise.

Do and Don't

Do
          
EditView history
          
The lowest-emphasis option in a row that already has a stronger action above it, so the hierarchy reads top to bottom.

Don't
          
Confirm purchase
          
A Tertiary standing alone as the only way to complete a purchase is nearly invisible. The most important action on the screen needs more than a Tertiary's weight.

Accessibility

- Still a native <button> element with the same keyboard behavior as every other button type.
        
- Focus and hover states add a visible background or underline change, since the rest state alone has very little contrast to lean on.
        
- Label text still meets WCAG 2.2 AA contrast against the surrounding panel.

Related Components
      
Secondary Button (medium emphasis), Ghost Button (icon/dense-layout actions), Anchor (plain inline text links), Link Button.

{
  "component": "Button",
  "type": "Tertiary",
  "category": "Actions",
  "summary": "Tertiary Button is the lowest-emphasis boxed action in the system - text-only styling with no fill and no border at rest, used for actions that should be available but never compete visually with Primary or Secondary.",
  "whenToUse": [
    "Low-priority actions alongside higher-emphasis buttons - Learn More, Skip, View More.",
    "Secondary navigation inside a flow - Advanced Settings, a link to an optional step.",
    "Repeated actions in a dense layout - where even Secondary's border would add too much visual noise."
  ],
  "whenNotToUse": [
    "The main or supporting action of a screen - use Primary or Secondary so the hierarchy stays legible.",
    "Irreversible actions - always use Destructive, regardless of how minor the action seems.",
    "Anywhere the action needs strong discoverability - a Tertiary button can be easy to miss; use Secondary if visibility matters."
  ],
  "bestPractices": [
    "Reserve it for genuinely optional or low-stakes actions, not as a default fallback for anything without a clear priority.",
    "Still give it a real hit target and visible focus ring even though it has no border at rest.",
    "Avoid using more than one or two Tertiary buttons in the same row - it starts to read as a wall of plain text otherwise."
  ],
  "doAndDont": {
    "do": "The lowest-emphasis option in a row that already has a stronger action above it, so the hierarchy reads top to bottom.",
    "dont": "A Tertiary standing alone as the only way to complete a purchase is nearly invisible. The most important action on the screen needs more than a Tertiary's weight."
  },
  "accessibility": [
    "Still a native <button> element with the same keyboard behavior as every other button type.",
    "Focus and hover states add a visible background or underline change, since the rest state alone has very little contrast to lean on.",
    "Label text still meets WCAG 2.2 AA contrast against the surrounding panel."
  ],
  "relatedComponents": [
    "Secondary Button",
    "Ghost Button",
    "Anchor",
    "Link Button"
  ]
}

---

## Calendar

Source: calendar-default.html · Status: Available

Components · Data Display · Calendar
  Back to Calendar types

# Calendar
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
Use for a full, always-visible month grid for browsing dates or scheduling - one Calendar component, controlled by properties, not a one-off grid of divs rebuilt per screen.

## Properties

Enter a full month and year, such as February 2028. The day grid and full-date labels update together, including leap years and adjacent months. First day of week reflows the same month. Event and range states are preview examples.

        Month label

        First day of week
        
          Sunday
          Monday

## Live Preview
    
Both sizes compared side by side, each in 3 content states - Default, With events and Range preview. One matrix is rendered at the chosen Month label and First day of week.

## When to use
    
Any place someone needs to browse or scan a full month at once, rather than pick a single date from a compact popup.

      Booking/scheduling view
      Content publishing calendar
      Attendance tracker
      Event planning overview
      Habit tracker grid

## Component Guide

        Human View
        Machine View

Overview
      
Calendar is a full, always-visible month grid for browsing dates or scheduling - unlike Date Picker's compact trigger-and-popup pattern, Calendar stays open on the page so an entire month can be scanned, compared, and interacted with at once.

When to Use

- A booking or scheduling view - showing availability across a full month.
        
- A content publishing calendar or attendance tracker - seeing many dates' worth of data simultaneously.
        
- Event planning overviews or a habit-tracker grid - any case where scanning the whole month matters more than a compact popup.

When Not to Use

- Picking a single date within a form - use Date Picker's compact trigger instead of dedicating a full grid to the page.
        
- A bounded start/end pair - use Date Range.
        
- A screen with limited space where a full month grid can't be shown clearly - consider a Date Picker's popup calendar instead of a permanently visible one.

Best Practices

- Highlight today's date clearly and consistently, so orientation within the month is immediate.
        
- Use event dots or markers sparingly - too many per day makes the grid noisy and hard to scan.
        
- Keep the first day of the week configurable to match locale or organizational convention (Sunday vs. Monday).

Do and Don't

Do

March 2026
MoTuWeThFrSaSu
29123
          
Leading days from the previous month are shown dimmed rather than hidden, so the grid never looks like a broken week with cells missing.

Don't

March 2026
MoTuWe
123
          
Starting the grid at day 1 with no leading blanks makes every week after the first misalign with its weekday header.

Accessibility

- Each day cell is independently focusable and announces its full date, not just the day number.
        
- Today, selected, and out-of-month days are each distinguishable by more than color alone.
        
- Fully keyboard-navigable - arrow keys move between days, Page Up/Down move between months.

Related Components
      
Date Picker, Date Range, Table.

{
  "component": "Calendar",
  "category": "Data Display",
  "summary": "Calendar is a full, always-visible month grid for browsing dates or scheduling - unlike Date Picker's compact trigger-and-popup pattern, Calendar stays open on the page so an entire month can be scanned, compared, and interacted with at once.",
  "whenToUse": [
    "A booking or scheduling view - showing availability across a full month.",
    "A content publishing calendar or attendance tracker - seeing many dates' worth of data simultaneously.",
    "Event planning overviews or a habit-tracker grid - any case where scanning the whole month matters more than a compact popup."
  ],
  "whenNotToUse": [
    "Picking a single date within a form - use Date Picker's compact trigger instead of dedicating a full grid to the page.",
    "A bounded start/end pair - use Date Range.",
    "A screen with limited space where a full month grid can't be shown clearly - consider a Date Picker's popup calendar instead of a permanently visible one."
  ],
  "bestPractices": [
    "Highlight today's date clearly and consistently, so orientation within the month is immediate.",
    "Use event dots or markers sparingly - too many per day makes the grid noisy and hard to scan.",
    "Keep the first day of the week configurable to match locale or organizational convention (Sunday vs. Monday)."
  ],
  "doAndDont": {
    "do": "Leading days from the previous month are shown dimmed rather than hidden, so the grid never looks like a broken week with cells missing.",
    "dont": "Starting the grid at day 1 with no leading blanks makes every week after the first misalign with its weekday header."
  },
  "accessibility": [
    "Each day cell is independently focusable and announces its full date, not just the day number.",
    "Today, selected, and out-of-month days are each distinguishable by more than color alone.",
    "Fully keyboard-navigable - arrow keys move between days, Page Up/Down move between months."
  ],
  "relatedComponents": [
    "Date Picker",
    "Date Range",
    "Table"
  ]
}

---

## Calendar

Source: calendar.html · Status: Available

Components · Data Display

# Calendar
  
A full month grid for browsing dates or scheduling - a month/year header, day-of-week column labels and a 6-row day grid, with today highlighted and small dots marking days that have events.

## Calendar type

Copy a ready-to-paste AI prompt or the working code - both use this system's own color tokens and Inter, never arbitrary values. Click the card to configure it in full.

September 2026

              Su
              Mo
              Tu
              We
              Th
              Fr
              Sa

              30
              31
              1
              2
              3
              4
              5
              6
              7
              8
              9
              10
              11
              12
              13
              14
              15
              16
              17
              18
              19
              20
              21
              22
              23
              24
              25
              26
              27
              28
              29
              30
              1
              2
              3
              4
              5
              6
              7
              8
              9
              10

System Control

          Copy prompt

---

## Card

Source: card-default.html · Status: Available

Components · Data Display · Card
  Back to Card types

# Card
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
Use for grouping related content into a bordered container, with an optional cover/media area or a footer row of action buttons - one Card component, controlled by properties, not a one-off box built from scratch each time.

## Properties

Corner radius, size, title, body text and resting shadow are properties of the same component, not separate cards - change them below to check this card's types and states in the Live Preview.

        Corner radius

        Size

        Title

        Body

        Show shadow

          resting drop-shadow beneath the card

## Live Preview
    
All 3 types compared side by side, each in all 5 states - Rest, Hover, Selected, Disabled and Loading. One full matrix is rendered per selected combination of Corner radius and Size, with the current title, body text and shadow setting applied throughout.

## When to use
    
Any time related content needs to be grouped into its own bordered container, distinct from the surrounding page.

      Dashboard summary tile
      Product listing
      Team member profile
      Settings section grouping
      Blog post preview

## Component Guide

        Human View
        Machine View

Overview
      
Card groups related content into a bordered container, with an optional cover/media area or a footer row of action buttons - a general-purpose content grouping used across dashboards, listings, and profiles wherever a distinct, self-contained unit of information needs visual containment.

When to Use

- A dashboard summary tile - a self-contained block of related metrics or info.
        
- A product listing item or a team member profile - grouping an image, title, and details together.
        
- A settings section grouping or a blog post preview - any distinct, self-contained unit of content.

When Not to Use

- Content that's actually a single flat list of similar rows - use List instead - wrapping every row in its own Card adds unnecessary visual weight.
        
- A small piece of contextual detail tied to a specific trigger - use Popover instead of a full Card.
        
- Structured label/value data with no need for a border or media area - use Description.

Best Practices

- Keep one Card focused on one coherent unit of content - avoid stuffing unrelated information into the same card.
        
- Use the media/cover area only when a visual genuinely represents the card's subject, not as decoration.
        
- Keep footer actions limited to the one or two most relevant actions for that card's content.

Do and Don't

Do

Q1 revenue report
Summary of bookings, churn and expansion for the first quarter.
          
One subject per card, with a title short enough to scan and body copy that fits without truncating.

Don't

Q1 revenue report, churn analysis, and next quarter's hiring plan
Everything from this quarter and some notes on hiring too, plus a few other things worth mentioning here.
          
Stacking unrelated subjects into one card makes the title wrap past recognition and the card unclickable as a single unit - split it into two.

Accessibility

- When a whole card is clickable, it's implemented as a real link or button, not a div with only a visual hover style.
        
- Heading structure inside a card follows the page's real hierarchy (an h2/h3, not just bold text) so screen-reader navigation stays meaningful.
        
- Interactive elements inside a clickable card (like a footer button) remain independently reachable and don't get swallowed by the card's own click handler.

Related Components
      
List, Collapse, Description.

{
  "component": "Card",
  "category": "Data Display",
  "summary": "Card groups related content into a bordered container, with an optional cover/media area or a footer row of action buttons - a general-purpose content grouping used across dashboards, listings, and profiles wherever a distinct, self-contained unit of information needs visual containment.",
  "whenToUse": [
    "A dashboard summary tile - a self-contained block of related metrics or info.",
    "A product listing item or a team member profile - grouping an image, title, and details together.",
    "A settings section grouping or a blog post preview - any distinct, self-contained unit of content."
  ],
  "whenNotToUse": [
    "Content that's actually a single flat list of similar rows - use List instead - wrapping every row in its own Card adds unnecessary visual weight.",
    "A small piece of contextual detail tied to a specific trigger - use Popover instead of a full Card.",
    "Structured label/value data with no need for a border or media area - use Description."
  ],
  "bestPractices": [
    "Keep one Card focused on one coherent unit of content - avoid stuffing unrelated information into the same card.",
    "Use the media/cover area only when a visual genuinely represents the card's subject, not as decoration.",
    "Keep footer actions limited to the one or two most relevant actions for that card's content."
  ],
  "doAndDont": {
    "do": "One subject per card, with a title short enough to scan and body copy that fits without truncating.",
    "dont": "Stacking unrelated subjects into one card makes the title wrap past recognition and the card unclickable as a single unit - split it into two."
  },
  "accessibility": [
    "When a whole card is clickable, it's implemented as a real link or button, not a div with only a visual hover style.",
    "Heading structure inside a card follows the page's real hierarchy (an h2/h3, not just bold text) so screen-reader navigation stays meaningful.",
    "Interactive elements inside a clickable card (like a footer button) remain independently reachable and don't get swallowed by the card's own click handler."
  ],
  "relatedComponents": [
    "List",
    "Collapse",
    "Description"
  ]
}

---

## Card

Source: card.html · Status: Available

Components · Data Display

# Card
  
A bordered container for grouping related content, optionally with a cover/media area at the top or a footer row of action buttons.

## Card type

Copy a ready-to-paste AI prompt or the working code - both use this system's own color tokens and Inter, never arbitrary values. Click the card to configure it in full.

Team standup
              
Daily sync at 9:30 AM in the main conference room.

System Control

          Copy prompt

---

## Cascader

Source: cascader-default.html · Status: Available

Components · Forms · Cascader
  Back to Cascader types

# Cascader
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
Use for a field that selects hierarchical, multi-level data - like Country / State / City - where picking an option in one column reveals the next column's choices, letting the user drill down to a final value.

## Properties

Size, corner radius, label and placeholder are properties of the same component, not separate fields - change them below to check this field's style and states in the Live Preview.

        Size

        Corner radius

        Label

        Placeholder

        Allow clear

          × replaces chevron once filled

        Required

          shows a required indicator

        Supporting text

          shown below the field

        Supporting text

        Error message

## Live Preview
    
Both types compared side by side, each in all 10 states. One full matrix is rendered per selected combination of Size and Corner radius - check more than one option in a dropdown to see every combination side by side.

## Multiple selection + Search
    
Two documented Ant Cascader features the matrix above can't show, since it's single-select with no search: typing narrows the first column to matches (highlighted inline), and a checkbox per option lets more than one leaf be picked across different branches - here, China and Beijing are checked at once, in different columns.

## When to use
    
Any field that selects hierarchical, multi-level data where each choice narrows down the next set of options, rather than a single flat list.

      Address (Country/State/City)
      Category drill-down
      Org chart picker
      File path picker
      Date-part picker (Year/Month/Day)

## Validation
    
A required Cascader has two invalid states, not one: nothing picked at all, and a path started but never finished - a user who picked Country and State but never reached City has technically "touched" the field, so the error needs to say which level is still open rather than treating both cases the same.

- Required marking - the red asterisk sits on the field label, same as Select, regardless of how many levels the path has.
      
- Validation timing - validate on blur (closing the panel without reaching a leaf) and again on submit, so an incomplete path is caught the moment the user moves on, not only at the end of the form.
      
- Error message - distinguish the two failure modes: "Choose a location" when nothing is selected at all, versus "Choose a city to finish this selection" when Country and State are picked but City isn't - a generic "Required field" doesn't tell the user which column to reopen.
      
- Recovery - reopening the panel from an incomplete-path error should land on the column where the path stopped, not back at column one, so the user resumes rather than restarts.

## Component Guide

        Human View
        Machine View

Overview
      
Cascader selects hierarchical, multi-level data - like Country / State / City - through a multi-column panel where picking an option in one column reveals the next column's choices, letting the user drill down step by step to a final value.

When to Use

- A hierarchical address or location field - Country, then State/Province, then City.
        
- A category drill-down - a top-level category narrowing into subcategories.
        
- An org chart or file-path picker - any strictly nested structure with a clear parent-to-child relationship.

When Not to Use

- A single flat list with no hierarchy - use Select instead - Cascader's multi-column panel adds unneeded complexity for a non-nested choice.
        
- Data that's nested but the user needs to see the whole tree at once, expanding and collapsing branches freely - use Tree Select instead of Cascader's linked-column drill-down.
        
- Free-form text with a suggestion list - use Autocomplete, not a fixed hierarchical structure.

Best Practices

- Show the full selected path in the closed trigger (e.g. "Asia / India / Mumbai"), not just the final leaf value.
        
- Keep each column's option count reasonable - if the deepest level has hundreds of items, add search/filtering within the column.
        
- Let users jump back to an earlier column to change a prior choice without restarting the whole selection.

Do and Don't

Do

Category
Audio / Headphones▾

Audio›
Video›

Headphones
Speakers
          
A genuine hierarchy, two levels deep, with the chosen path spelled out in the control so the selection is readable without reopening it.

Don't

Country
Portugal▾

Portugal
Spain
          
A single flat level in a Cascader is a Select wearing extra machinery. Only reach for it when the options genuinely nest.

Accessibility

- Each column is independently reachable and operable by keyboard, with arrow keys moving within a column and revealing the next one on selection.
        
- The currently selected path at every level is announced as the user drills down, not only shown visually.
        
- The trigger's accessible name reflects the full selected path once a choice is made.

Related Components
      
Select, Tree Select, Autocomplete.

{
  "component": "Cascader",
  "category": "Forms",
  "summary": "Cascader selects hierarchical, multi-level data - like Country / State / City - through a multi-column panel where picking an option in one column reveals the next column's choices, letting the user drill down step by step to a final value.",
  "whenToUse": [
    "A hierarchical address or location field - Country, then State/Province, then City.",
    "A category drill-down - a top-level category narrowing into subcategories.",
    "An org chart or file-path picker - any strictly nested structure with a clear parent-to-child relationship."
  ],
  "whenNotToUse": [
    "A single flat list with no hierarchy - use Select instead - Cascader's multi-column panel adds unneeded complexity for a non-nested choice.",
    "Data that's nested but the user needs to see the whole tree at once, expanding and collapsing branches freely - use Tree Select instead of Cascader's linked-column drill-down.",
    "Free-form text with a suggestion list - use Autocomplete, not a fixed hierarchical structure."
  ],
  "bestPractices": [
    "Show the full selected path in the closed trigger (e.g. \"Asia / India / Mumbai\"), not just the final leaf value.",
    "Keep each column's option count reasonable - if the deepest level has hundreds of items, add search/filtering within the column.",
    "Let users jump back to an earlier column to change a prior choice without restarting the whole selection."
  ],
  "doAndDont": {
    "do": "A genuine hierarchy, two levels deep, with the chosen path spelled out in the control so the selection is readable without reopening it.",
    "dont": "A single flat level in a Cascader is a Select wearing extra machinery. Only reach for it when the options genuinely nest."
  },
  "accessibility": [
    "Each column is independently reachable and operable by keyboard, with arrow keys moving within a column and revealing the next one on selection.",
    "The currently selected path at every level is announced as the user drills down, not only shown visually.",
    "The trigger's accessible name reflects the full selected path once a choice is made."
  ],
  "relatedComponents": [
    "Select",
    "Tree Select",
    "Autocomplete"
  ]
}

---

## Cascader

Source: cascader.html · Status: Available

Components · Forms

# Cascader
  
A select-like field for hierarchical, multi-level data - like Country / State / City - where picking an option in one column reveals the next column's choices, letting the user drill down to a final value.

## Cascader type

Copy a ready-to-paste AI prompt or the working code - both use this system's own color tokens and Inter, never arbitrary values. Click the card to configure it in full.

            Location

Cascader

          Copy prompt

---

## Changelog

Source: changelog.html · Status: Available

# Changelog
  
The real, working history of this system - generated straight from CHANGELOG.md (tools/generate_changelog.py), the same file every session's work has actually been recorded in. This replaces "Changelog: not yet tracked" on every component page with a real link here.

## Entries
    Search implementation changesClear search

## Known gaps

---

## Checkbox

Source: checkbox-default.html · Status: Available

Components · Forms · Checkbox
  Back to Checkbox types

# Checkbox
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
Use for agreements, multi-select lists and settings rows where more than one option can be active at once - one Checkbox component, controlled by properties, with a real tri-state (unchecked, checked, indeterminate) control underneath.

## Properties

Size, corner radius and label are properties of the same component, not separate checkboxes - change them below to check this control's style and states in the Live Preview.

        Size

        Corner radius

        Label

        Label placement
        
          Right of checkbox
          Left of checkbox

        Required

          shows a required indicator

        Supporting text

          shown below the label

        Supporting text

        Error

          shown below the label

        Error message

## Live Preview
    
Both types compared side by side, each in all 6 states. One full matrix is rendered per selected combination of Size and Corner radius.

## When to use
    
Any choice where more than one option can be selected at once, or where a single agreement needs an explicit on/off toggle.

      Terms agreement
      Select multiple
      Settings toggle list
      Bulk select in a table

## Validation
    
A single required checkbox, like a Terms of Service agreement, has no half-checked state to catch on blur - validate it on submit instead.

- Required marking - unlike a text field, there's no natural "on blur" moment for a checkbox, so check the required state on submit rather than as the user tabs past it.
      
- Validation timing - validate a required checkbox at submit, not on blur.
      
- Error message - put the message and required indicator right next to the checkbox's own label, "You must agree to the Terms of Service to continue," not a separate banner far from the control.
      
- Checkbox lists - for a list of selectable items, "required" more often means at least one must be checked - validate that at the group/fieldset level, not per checkbox.

## Component Guide

        Human View
        Machine View

Overview
      
Checkbox is a tri-state control (unchecked, checked, indeterminate) for choices where more than one option can be active at once, or for a single explicit agreement toggle - unlike Radio, which enforces exactly one choice from a set.

When to Use

- An explicit agreement toggle - accepting terms and conditions.
        
- Selecting multiple items from a list - picking several rows in a table, several tags in a filter.
        
- A settings page's list of independent toggles - each one on or off without affecting the others.

When Not to Use

- Exactly one choice from a small, fully visible set - use Radio so only one option can ever be selected.
        
- An immediate, standalone on/off setting outside a form - use Switch - it applies instantly with no submit step.
        
- A value chosen from a very large list - use a multi-select Select variant or Transfer instead of dozens of checkboxes.

Best Practices

- Always show a visible label next to the box - never the checkbox alone with no text.
        
- Use the indeterminate state for a "select all" checkbox that reflects a partial child selection.
        
- Group related checkboxes visually, with a shared heading or fieldset, so the set of options reads as one question.

Do and Don't

Do

Email me about order updates
          
A label that states what checking it actually does, so the choice is clear without reading anything else.

Don't

Do not opt out of non-essential email
          
A double negative makes the user solve a logic puzzle to work out what checking the box means.

Accessibility

- Uses real native checkbox semantics - checked and indeterminate are reflected in the accessibility tree, not just visually.
        
- The label is clickable and programmatically linked to its input.
        
- Indeterminate is set via the DOM property (not CSS alone) so assistive technology announces the partial-selection state correctly.

Related Components
      
Radio, Switch, Transfer (bulk multi-select across two panels), Group Button.

{
  "component": "Checkbox",
  "category": "Forms",
  "summary": "Checkbox is a tri-state control (unchecked, checked, indeterminate) for choices where more than one option can be active at once, or for a single explicit agreement toggle - unlike Radio, which enforces exactly one choice from a set.",
  "whenToUse": [
    "An explicit agreement toggle - accepting terms and conditions.",
    "Selecting multiple items from a list - picking several rows in a table, several tags in a filter.",
    "A settings page's list of independent toggles - each one on or off without affecting the others."
  ],
  "whenNotToUse": [
    "Exactly one choice from a small, fully visible set - use Radio so only one option can ever be selected.",
    "An immediate, standalone on/off setting outside a form - use Switch - it applies instantly with no submit step.",
    "A value chosen from a very large list - use a multi-select Select variant or Transfer instead of dozens of checkboxes."
  ],
  "bestPractices": [
    "Always show a visible label next to the box - never the checkbox alone with no text.",
    "Use the indeterminate state for a \"select all\" checkbox that reflects a partial child selection.",
    "Group related checkboxes visually, with a shared heading or fieldset, so the set of options reads as one question."
  ],
  "doAndDont": {
    "do": "A label that states what checking it actually does, so the choice is clear without reading anything else.",
    "dont": "A double negative makes the user solve a logic puzzle to work out what checking the box means."
  },
  "accessibility": [
    "Uses real native checkbox semantics - checked and indeterminate are reflected in the accessibility tree, not just visually.",
    "The label is clickable and programmatically linked to its input.",
    "Indeterminate is set via the DOM property (not CSS alone) so assistive technology announces the partial-selection state correctly."
  ],
  "relatedComponents": [
    "Radio",
    "Switch",
    "Transfer",
    "Group Button"
  ]
}

---

## Checkbox

Source: checkbox.html · Status: Available

Components · Forms

# Checkbox
  
A small square selection control with 3 possible values (unchecked, checked, indeterminate), always paired with a text label - for agreements, multi-select lists and settings rows.

## Checkbox type

Copy a ready-to-paste AI prompt or the working code - both use this system's own color tokens and Inter, never arbitrary values. Click the card to configure it in full.

            I agree to the terms

Checkbox

          Copy prompt

---

## Collapse

Source: collapse-default.html · Status: Available

Components · Data Display · Collapse
  Back to Collapse types

# Collapse
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
Use for progressively disclosing long or secondary content behind a clickable header - one Collapse component, controlled by properties, not a one-off show/hide toggle rebuilt per screen.

## Properties

Corner radius, size, header text, body text and chevron visibility are properties of the same component, not separate panels - change them below to check this collapse's types and states in the Live Preview.

        Corner radius

        Size

        Header text

        Body text

        Show icon

          shown on the right side of the header

## Live Preview
    
Both types compared side by side, each in all 3 states - Collapsed, Expanded and Disabled. One full matrix is rendered per selected combination of Corner radius and Size, with the current header text, body text and chevron visibility applied throughout.

## When to use
    
Any long or secondary content that benefits from being hidden by default and revealed on demand.

      FAQ list
      Settings section grouping
      Filter panel sections
      Order details breakdown
      Terms and conditions sections

## Component Guide

        Human View
        Machine View

Overview
      
Collapse progressively discloses long or secondary content behind a clickable header - the content stays hidden until expanded, keeping the page compact while still making the detail available on demand.

When to Use

- An FAQ list - each question collapsed until clicked.
        
- Settings section grouping or filter panel sections - organizing a long settings page into expandable chunks.
        
- An order details breakdown or terms and conditions section - long content that most users won't need expanded by default.

When Not to Use

- Content everyone needs to see immediately - hiding essential information behind a click adds friction; show it directly instead.
        
- A single, always-visible section with no reason to hide it - a static Card or plain section is simpler when there's no benefit to collapsing.
        
- Switching between different views of content rather than showing/hiding one section - use Tabs instead of Collapse.

Best Practices

- Make the whole header row clickable, not just a small chevron icon, so the hit target is generous.
        
- Default the most commonly needed section open when there's a clear default, rather than collapsing everything.
        
- Animate the expand/collapse transition smoothly so content doesn't just snap in and out abruptly.

Do and Don't

Do

Shipping details
Delivered by courier, 2-4 business days.
          
A header naming exactly what is inside, so opening it is a deliberate choice rather than a guess.

Don't

More info

Details
          
Two panels both titled something generic give the user no way to predict which one holds what they need - they have to open both.

Accessibility

- The header exposes aria-expanded, reflecting whether its panel is currently open.
        
- The header is a real, keyboard-operable button, not a div with only a click handler.
        
- The expanded panel is programmatically associated with its header via aria-controls, so the relationship is explicit.

Related Components
      
Tabs, Card, Description.

{
  "component": "Collapse",
  "category": "Data Display",
  "summary": "Collapse progressively discloses long or secondary content behind a clickable header - the content stays hidden until expanded, keeping the page compact while still making the detail available on demand.",
  "whenToUse": [
    "An FAQ list - each question collapsed until clicked.",
    "Settings section grouping or filter panel sections - organizing a long settings page into expandable chunks.",
    "An order details breakdown or terms and conditions section - long content that most users won't need expanded by default."
  ],
  "whenNotToUse": [
    "Content everyone needs to see immediately - hiding essential information behind a click adds friction; show it directly instead.",
    "A single, always-visible section with no reason to hide it - a static Card or plain section is simpler when there's no benefit to collapsing.",
    "Switching between different views of content rather than showing/hiding one section - use Tabs instead of Collapse."
  ],
  "bestPractices": [
    "Make the whole header row clickable, not just a small chevron icon, so the hit target is generous.",
    "Default the most commonly needed section open when there's a clear default, rather than collapsing everything.",
    "Animate the expand/collapse transition smoothly so content doesn't just snap in and out abruptly."
  ],
  "doAndDont": {
    "do": "A header naming exactly what is inside, so opening it is a deliberate choice rather than a guess.",
    "dont": "Two panels both titled something generic give the user no way to predict which one holds what they need - they have to open both."
  },
  "accessibility": [
    "The header exposes aria-expanded, reflecting whether its panel is currently open.",
    "The header is a real, keyboard-operable button, not a div with only a click handler.",
    "The expanded panel is programmatically associated with its header via aria-controls, so the relationship is explicit."
  ],
  "relatedComponents": [
    "Tabs",
    "Card",
    "Description"
  ]
}

---

## Collapse

Source: collapse.html · Status: Available

Components · Data Display

# Collapse
  
An accordion-style panel with a clickable header that reveals or hides its body content beneath it when toggled, useful for progressively disclosing long or secondary content.

## Collapse type

Copy a ready-to-paste AI prompt or the working code - both use this system's own color tokens and Inter, never arbitrary values. Click the card to configure it in full.

                What's included in the free plan?

The free plan includes up to 3 projects, 1GB of storage, and community support.

System Control

          Copy prompt

---

## Color Picker

Source: color-picker-default.html · Status: Available

Components · Forms · Color Picker
  Back to Color Picker types

# Color Picker
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
Use for any field where someone chooses a color - it shows the currently selected color as a swatch plus its hex value, and opens a palette of preset swatch options when focused or clicked.

## Properties

Size, corner radius, label and color value are properties of the same component, not separate fields - change them below to check this field's style and states in the Live Preview.

        Size

        Corner radius

        Label

        Color value

        Allow clear

          × button resets to default

        Value format
        
          Hex (#FF031A)
          RGB (rgb(255, 3, 26))
          Design token name

        Token name

        Swatch shape
        
          Square
          Round

        Required

          shows a required indicator

        Supporting text

          shown below the field

        Supporting text

        Error message

## Live Preview
    
Both types compared side by side, each in all 9 states. One full matrix is rendered per selected combination of Size and Corner radius - check more than one option in a dropdown to see every combination side by side.

## Try it
    
A real, working Color Picker - click the field to open the palette, grouped into Brand, Neutral and Custom swatches, and click a swatch to select it. Escape or clicking outside closes the panel without changing the value.

## When to use
    
Any field where someone chooses or edits a color, such as a brand color, theme customization, a chart series color, or a label highlight color.

      Brand color
      Theme customization
      Chart series color
      Label color
      Highlight color

## Validation
    
The swatch and preset palette can't produce an invalid value by definition - validation is really about the typed or pasted hex text, since that's the only way to enter a value the component can't already guarantee is well-formed.

- Validation timing - validate the typed value on blur, not on every keystroke - a partial string like "#3a" is a normal in-progress state while typing, not an error.
      
- Format check - accept 3 or 6 hex digits after a #, adding the # automatically if it was left off, and accept rgb()/hsl() if the field supports those formats too.
      
- Error message - be specific about the expected format, e.g. "Enter a valid hex color, like #FF6B00," rather than a generic "Invalid color."
      
- Recovery - on an invalid blur, revert the text to the last valid color rather than leaving the mismatched text and swatch out of sync - or gray out the swatch until the value is corrected.

## Component Guide

        Human View
        Machine View

Overview
      
Color Picker shows the currently selected color as a swatch plus its hex value, and opens a palette of preset swatch options when focused or clicked - used for any field where the user chooses or edits a color rather than typing arbitrary text.

When to Use

- Brand color selection - picking a primary accent color for a theme.
        
- Theme customization - letting a user personalize colors in a settings panel.
        
- Assigning a color to a chart series or a label - so categories are visually distinguishable.

When Not to Use

- A value that isn't actually a color - use Input or Select for plain text or fixed options.
        
- A fixed, non-customizable color defined by the design system itself - there's no need for a picker when the value can never change.
        
- Selecting from a very large, unconstrained color space with precise numeric control (e.g. exact RGB channel entry) as the primary use case - pair the swatch picker with a text hex input, which this component already provides, rather than building a separate numeric-only control.

Best Practices

- Always show the current value as both a visual swatch and its hex code, since color alone can be hard to communicate precisely.
        
- Offer a curated preset palette in addition to free hex entry, so most users never need to type a hex value.
        
- Validate typed hex values immediately and fall back to the last valid color on invalid input, rather than letting the field go blank.

Do and Don't

Do

Brand colour
#FF031A
          
The swatch is paired with the hex value, so the choice can be read, copied and checked without trusting the screen's calibration.

Don't

Brand colour

A swatch with no value is unreadable to anyone who cannot distinguish it from the neighbouring shade, and impossible to reproduce elsewhere.

Accessibility

- The swatch alone never conveys the selected value - the hex text is always present for anyone who can't distinguish it visually.
        
- Preset swatches in the open panel are reachable and selectable by keyboard, not just by mouse click.
        
- The field's accessible name states what the color controls ("Brand color"), not just "Color".

Related Components
      
Input, Select, Slider.

{
  "component": "Color Picker",
  "category": "Forms",
  "summary": "Color Picker shows the currently selected color as a swatch plus its hex value, and opens a palette of preset swatch options when focused or clicked - used for any field where the user chooses or edits a color rather than typing arbitrary text.",
  "whenToUse": [
    "Brand color selection - picking a primary accent color for a theme.",
    "Theme customization - letting a user personalize colors in a settings panel.",
    "Assigning a color to a chart series or a label - so categories are visually distinguishable."
  ],
  "whenNotToUse": [
    "A value that isn't actually a color - use Input or Select for plain text or fixed options.",
    "A fixed, non-customizable color defined by the design system itself - there's no need for a picker when the value can never change.",
    "Selecting from a very large, unconstrained color space with precise numeric control (e.g. exact RGB channel entry) as the primary use case - pair the swatch picker with a text hex input, which this component already provides, rather than building a separate numeric-only control."
  ],
  "bestPractices": [
    "Always show the current value as both a visual swatch and its hex code, since color alone can be hard to communicate precisely.",
    "Offer a curated preset palette in addition to free hex entry, so most users never need to type a hex value.",
    "Validate typed hex values immediately and fall back to the last valid color on invalid input, rather than letting the field go blank."
  ],
  "doAndDont": {
    "do": "The swatch is paired with the hex value, so the choice can be read, copied and checked without trusting the screen's calibration.",
    "dont": "A swatch with no value is unreadable to anyone who cannot distinguish it from the neighbouring shade, and impossible to reproduce elsewhere."
  },
  "accessibility": [
    "The swatch alone never conveys the selected value - the hex text is always present for anyone who can't distinguish it visually.",
    "Preset swatches in the open panel are reachable and selectable by keyboard, not just by mouse click.",
    "The field's accessible name states what the color controls (\"Brand color\"), not just \"Color\"."
  ],
  "relatedComponents": [
    "Input",
    "Select",
    "Slider"
  ]
}

---

## Color Picker

Source: color-picker.html · Status: Available

Components · Forms

# Color Picker
  
A field that shows the currently selected color as a small swatch plus its hex value, and opens a palette of preset swatch options when focused or clicked.

## Color Picker type

Copy a ready-to-paste AI prompt or the working code - both use this system's own color tokens and Inter, never arbitrary values. Click the card to configure it in full.

            Brand color

              #FF031A

Color Picker Field

          Copy prompt

---

## Component Contract Editor

Source: component-editor.html · Status: Available

Components · Authoring

# Component Contract Editor

Define the component once. Preview, prompts, HTML and Figma use its saved contract.

## Component and revisions

New componentEdit componentSave componentCancel changesResume draftDiscard pending draft

 · Stable ID: 

NameAuthoring sourceContract leads; Figma followsFigma leads; review pulled changesRestore revision as draft
Open a saved component or library guide

Component draft

## Properties
Stable IDs bind properties to parts, variants and behavior. Suggestions reuse saved library conventions.

New property nameTypetextbooleanoptionsnumberswapsloteventAdd property

## Stage and variants

Edit base or variant stylesVariant name

Save selection as variantRemove selected variant

## Anatomy
Select a part to edit its content, nesting, visibility, layout and token bindings. Choose a variant above to edit its style overrides.
New part kindcontainertexticonslotinstanceshapeAdd inside selected partUse current Foundation tokens

## Behavior
Bind native events to property changes. Values can be JSON, $toggle for booleans or $value for an input value. Event properties describe application callbacks; connect those in your application.

Target partEventclickchangeinputPropertyValueAdd behavior

## Contract JSON
Advanced editing includes full conditions, token bindings, attributes, slot content and adapter references. Validation runs before saving or exporting.Versioned specificationApply JSON to draft

## Review and export
Download contract JSONDownload HTMLCopy contract promptCopy HTMLImport a component contract as a draftChanges from saved revision
Generated promptGenerated HTML

## Compare implementation
Upload an exported HTML component, a rendered HTML snapshot from the inspection tool, or a component contract JSON. HTML comparison runs without uploaded scripts. Differences identify the property or anatomy part that changed.Implementation HTML or contract JSON
No implementation compared yet.

## Figma synchronization
Run the supplied local bridge and import the development plugin into Figma. Push sends the full contract and waits for the plugin's result. Pull requires Figma as the authoring source and creates a reviewable draft.
Push contract to FigmaPull from Figma as draftBridge setup

---

## Components

Source: component-index.html · Status: Available

Design System · Components

# Components
  
Every component in this library, grouped the same way the sidebar groups them - 61 entries across 5 categories. Looking for a specific one? Use Filter navigation in the sidebar instead; this page is for browsing the whole catalog at once.

## Actions
    
Things a person does, not things they read - buttons and the controls that trigger them.

Button
      
Group Button
      
Float Button

## Forms
    
Every way this system collects a value from someone, from a single checkbox to a multi-field date range.

Input
      
Select
      
Checkbox
      
Radio
      
Switch
      
Date Picker
      
Password
      
Number
      
Mention
      
Autocomplete
      
Date Range
      
Time
      
Text Area
      
Search
      
Add-on
      
Color Picker
      
Slider
      
Rating
      
Cascader
      
Transfer
      
Tree Select
      
Upload

## Navigation
    
How someone moves between sections, pages or steps.

Tabs
      
Anchor
      
Breadcrumb
      
Dropdown
      
Pagination
      
Menu
      
Steps
      
Affix

## Feedback
    
Tells someone what just happened, what's happening now, or asks them to confirm before something does.

Alert
      
Toast
      
Modal
      
Tooltip
      
Tour
      
Drawer
      
Notification
      
Pop Confirm
      
Progress
      
Result
      
Skeleton
      
Spin

## Data Display
    
Presents information someone reads rather than acts on - cards, lists, tables and the pieces inside them.

Divider
      
Avatar
      
Badge
      
Calendar
      
Card
      
Collapse
      
Description
      
Empty
      
Image
      
List
      
Popover
      
Splitter
      
Statistic
      
Table
      
Tag
      
Timeline
      
Tree

---

## Button

Source: components.html · Status: Available

Components · Actions

# Button
  
Choose the purpose first, the visual treatment second, the interaction third - one Button component, controlled by properties, not a hundred one-off variants.

## Button type

        Upload icon variation

Copy a ready-to-paste AI prompt or the working code for any type - both use this system's own color tokens and Inter, never arbitrary values. Click a card to configure that type in full.

      Corner radius - applies to every card
      
        0px - Sharp
        4px - Compact
        8px - Balanced
        12px - Soft
        Full - Pill

Icons uploaded here become available as custom icon variations for button content (icon-left, icon-right, icon-both, icon-only) - anyone with edit access to this page can add or remove them.

Primary

  Save
  
Button

          Copy prompt

Primary · Dual Icon

  Save
  
Insure Edge

          Copy prompt

---

## Copywriting

Source: copywriting.html · Status: Available

# Copywriting
  
How this system writes to the user - tone, grammar and the specific rules that make an error message actually useful instead of just accurate.

## Voice
    
Write from what the user can now do, not from what the product did. Explain the result and the next step, never just the failure.

        Perspective
        
"You" for the user, "we" only when acknowledging a complaint or a mistake on our side
        Rule

        Vocabulary
        
Plain words over jargon - a first-time user should never need a glossary
        Rule

        Consistency
        
One term per concept, used the same way everywhere - never "delete" here and "remove" there for the same action
        Rule

        Completeness
        
State the cause and the next step - never just "Something went wrong"
        Rule

        Restraint
        
Avoid absolute words ("never", "always") and commands ("can't", "don't") - offer guidance instead
        Rule

## Error messages
    
An error message has one job: get the user unstuck. A message that only reports failure without a cause or a next step has not done that job.

Do
        
Card declined. Try a different card, or contact your bank to confirm the charge went through.
        
Names the cause and gives two concrete next steps - the user can act immediately.

Don't
        
Payment failed. Please try again.
        
Restates the failure with no cause and a retry that's likely to fail the same way again.

## Capitalization and punctuation
    
Small, mechanical rules that matter precisely because they're invisible when followed and distracting the moment they're not - inconsistent casing or stray punctuation reads as carelessness even when the content itself is correct.

        Titles, buttons, labels
        
Sentence case - capitalize only the first word and proper nouns ("Save changes", not "Save Changes")
        Rule

        Product / acronym names
        
Full caps for genuine acronyms only (ESC, API) - not for emphasis
        Rule

        Numbers
        
Numerals over spelled-out numbers wherever a value appears - faster to scan ("3 items", not "three items")
        Rule

        Periods
        
Omit in labels, titles, tooltips and table cells - keep them in full sentences (help text, error messages)
        Rule

        Exclamation marks
        
Reserve for genuine congratulations or greetings - one on every confirmation reads as forced enthusiasm
        Rule

## Product terminology
    
One approved name per concept, used the same way in navigation, page titles and status copy - see the Consistency rule above. This list records the terms this system has actually standardized on and the retired variants a reader may still find in older copy or history.

        Export & Handoff
        
Use "Export & Handoff" for the page and navigation. Name its formats "Markdown" and "Figma"; actions specify the format, such as "Copy Markdown" or "Export to Figma".
        Approved

        NPM Package
        
Navigation, page title and Settings all say "NPM Package" - "Npm roadmap" and "Npm publishing" are retired variants, kept only in this record for history
        Approved

        Exception: action labels
        
A button or link may shorten a term for space ("Export .md", "npm install") as long as its destination's own title still uses the full approved name
        Exception

## Copywriting - Markdown export
    
This page's own content, as Markdown - copy it straight into your design system docs or hand it to an AI/agent workflow.

      Copy Markdown

## Implementation contract

Saved validated choices override project recommendations, which override system defaults. This implementation contract governs static specimens. Resolved tokens in the current export are authoritative values. Component exceptions must name the affected role and reason.

### Structure and states
Keep label/description/value aligned using the same three-column reference layout. Explain the next action and recovery in error text. Do not report Saved, Copied, Applied or Verified before the corresponding operation succeeds.

### Expansion and localization
Clamp explanatory prose only when it exceeds four rendered lines. Preserve adjacent values, accessible aria-expanded/aria-controls and focus on the toggle. Keep essential labels/errors untruncated. Test long translations, RTL and zoom without shrinking text.
Machine contract: section rules, storage, units and acceptance
{
  "schemaVersion": 1,
  "authority": "Saved validated choices override project recommendations, which override system defaults. This implementation contract governs static specimens. Resolved tokens in the current export are authoritative values. Component exceptions must name the affected role and reason.",
  "governance": {
    "owners": "Design System Lead owns token and compatibility policy. Designers own specimens and interaction contracts. Developers own resolver/export/import parity. QA and Accessibility own release evidence. Product teams own domain-specific confidence, privacy and retention policies.",
    "changes": "Change the JSON contract first, regenerate documentation/defaults/catalog/tokens, then run model, DOM and recipient checks. Link the changed finding IDs and evidence in the release review.",
    "compatibility": "Keep hue-named CSS tokens as compatibility aliases while semantic consumers migrate. Additive tokens retain schemaVersion 1. A removed/renamed key or changed stored meaning requires a schema migration, a version bump and a documented replacement before release. Keep the prior reader fixture until the migration is verified.",
    "deprecation": "Record old key, replacement, reason, introduced version, planned removal version and affected consumers. Do not remove a token while an active consumer still uses it. Future records are preserved rather than coerced.",
    "scope": "This is a web design system with one shared workspace profile. Native dp/sp adaptation and real agent execution require separate adapters and acceptance. User-defined colors and responsive exceptions require product-specific rendered verification."
  },
  "storage": {
    "version": 1,
    "legacy": "Unversioned valid records migrate in memory. Typography headingScaleVersion 2 applies the smaller six-heading scale once to older records, retaining other roles and existing font/color/style metrics. Later custom size edits are retained. Unsupported future records are preserved. The next successful write stamps the migrated version.",
    "future": "Reject unsupported future versions. Preserve raw data. Offer backup and explicit reset.",
    "invalid": "Foundation selections preview locally until Save foundation succeeds. Saved Foundation editors require Edit foundation before changes. Cancel discards the preview. Invalid drafts never replace saved records; storage failures retain the editable preview and the last durable record.",
    "concurrency": "A storage event refreshes applied tokens and disables stale editor controls until reload. Never merge simultaneous edits silently."
  },
  "units": {
    "base": "1rem = 16px at default browser settings. Do not fix the root font size.",
    "use": "Prefer rem for typography, spacing and control dimensions. Hairline borders and viewport thresholds may use px. Both equivalents appear in Markdown. SVG strokes use viewBox units. Ratios, percentages, columns, timing and weights are unitless or retain their own units.",
    "native": "Web CSS px/rem are not native dp/sp. A native adapter must map semantic roles, support text scaling and test device density. Native rendering is not shipped by this web library."
  },
  "acceptance": [
    "Compare page, applied tokens, durable record, Machine View and exported instructions.",
    "Test valid, unfinished, invalid, missing, malformed, legacy and future records. Exercise storage failure, reset, reload and another tab.",
    "Test 320, 375, 768, 1024 and 1440px widths, 200% zoom, text-spacing overrides, RTL and long/localized labels.",
    "Use keyboard and screen reader. Confirm focus return, names, values, error associations and status announcements.",
    "Verify actual rendered text/surface pairs, forced colors, reduced motion, print and exported recipes in a recipient fixture. Source or DOM checks alone are not rendered acceptance."
  ],
  "layers": {
    "content": 0,
    "sticky": 20,
    "popover": 40,
    "scrim": 60,
    "dialog": 70,
    "toast": 80,
    "tooltip": 90,
    "rules": "Each overlay gets an explicit owner and close/focus-return path. Portal menus out of clipped scroll containers. Nested dialogs stack one scrim per modal owner. Escape closes the top dismissible layer. Tooltips never block actions. Test collision and zoom; do not infer stacking order from shadow size."
  },
  "section": {
    "title": "Copywriting",
    "rules": {
      "Structure and states": "Keep label/description/value aligned using the same three-column reference layout. Explain the next action and recovery in error text. Do not report Saved, Copied, Applied or Verified before the corresponding operation succeeds.",
      "Expansion and localization": "Clamp explanatory prose only when it exceeds four rendered lines. Preserve adjacent values, accessible aria-expanded/aria-controls and focus on the toggle. Keep essential labels/errors untruncated. Test long translations, RTL and zoom without shrinking text."
    }
  }
}

---

## Data Format

Source: data-format.html · Status: Available

# Data Format
  
Set consistent display rules for numbers, dates and data states. Preview your choices, then copy the guidance or download the configuration.

## Numbers and currency
    
Format quantities consistently for the selected locale. Keep identifiers, phone numbers and postal codes as text to preserve leading zeros.

        Thousands separator
        Use locale grouping by default. Indian grouping, decimal marks and digit shapes follow the locale; custom grouping must not conflict with decimal marks.
        –

        Units
        Preserve unit-symbol case (kg, kW, °C). For SI quantities, choose a space or non-breaking space before the unit; no-space formatting is a project exception.
        –

        Currency
        The locale controls symbol position and spacing. Choose a symbol, currency code or name. Decimal precision fixes the displayed currency fraction; it does not convert currencies.
        –

        Percentages
        Pass a ratio: 0.125 means 12.5%. Locale controls the percent sign and spacing. Never multiply the value twice.
        –

        Large amounts
        Compact notation follows locale conventions. Use standard notation for exact comparisons. The expanded example below uses the selected decimal precision.
        –Expanded: 

        Tables
        Use tabular numerals and consistent alignment. End alignment is recommended for numeric columns; text identifiers keep their text alignment.
        –

## Dates and times
    
Keep calendar dates separate from timestamps. Date-only values retain their calendar day; timestamps are displayed in the selected time zone.

        Absolute date
        Choose YYYY-MM-DD for shared, unambiguous dates, or a locale or long date for readers in a known locale. This example is a date-only value.
        –

        Absolute time
        Choose a 12- or 24-hour clock for your audience. Include seconds only when needed. This timestamp is 14:08 UTC before conversion.
        –

        Combined
        The selected separator joins the display date and time. A T separator alone does not produce an ISO timestamp; use explicit-offset timestamps for data interchange.
        –

        Relative time
        When enabled, use localized seconds, minutes or hours for events within 24 hours, then an absolute date. When disabled, always show the date.
        –

        Time zone
        Use an IANA zone such as Asia/Kolkata. Show the zone when readers work across regions. Daylight-saving rules apply to the timestamp’s date.
        –

        Ranges
        Provide two valid dates in chronological order. The separator is configurable. Date-only endpoints remain unchanged in every time zone.
        –

## Missing and sensitive data
    
Use distinct states for zero, absent values, pending requests and errors. Masking is presentation only: remove sensitive data before delivering it to the browser.

        Zero
        A real zero is a value. Never replace it with the missing-value placeholder.
        –

        No value
        Use the configured placeholder for a confirmed absent value. An empty list instead needs a clear message such as “No results”.
        –

        Loading
        Use a skeleton or loading text while a request is pending. Announce loading once for the containing region, rather than every table cell.
        Loading…

        Invalid value
        Validate inputs before formatting and show a specific error. The formatter falls back to the missing placeholder for invalid input, so callers must preserve the error state.
        Invalid date — check the source value

        Empty list
        A completed search with no matches is an empty state, not a missing cell or a loading request.
        No results. Try a different search.

        Full redaction
        Replace every character with the chosen mask. Do not reveal the original value in tooltips, accessible names or exported content.
        –

        Partial redaction
        Reveal only the permitted trailing characters (0–8); at least one character always stays masked. The configured default controls generic redaction.
        –

        Default redaction
        This example follows the Full or Partial default selected above. Use only fictional data in examples.
        –

## Data Format - Markdown export
    
This page's own content, as Markdown - copy it straight into your design system docs or hand it to an AI/agent workflow.

      Copy Markdown

## Implementation contract

Saved validated choices override project recommendations, which override system defaults. This implementation contract governs static specimens. Resolved tokens in the current export are authoritative values. Component exceptions must name the affected role and reason.

### Flow
Configure a field, inspect its formatted example, copy/export current valid settings and reset/reload. Every valid input updates without blur. Invalid simultaneous fields all expose errors and retain the prior valid configuration.

### Constraints
Decimal precision 0–6, trailing reveal 0–8, one Unicode code point for the mask, a supported locale and valid IANA zone. Explicit comma grouping cannot conflict with a comma decimal locale. Distinguish real zero, missing, invalid and loading. Never reveal the entire value through a tooltip or accessible name.

### Layout and accessibility
Group number/currency, date/time and missing/sensitive settings with separators. Equal field heights and gutters, wrapped labels and responsive columns share the reference layout. Loading is announced once. Export the typed configuration and locale/zone/range/redaction rules.

### Value identity
Apply numeric formatting to quantities, not IDs, phone numbers, postal codes or tracking references. Preserve leading zeros. Numeric table alignment applies only to numeric kinds. Date-only values retain their calendar day regardless of time zone. Ranges require two valid ordered dates; partial redaction counts Unicode code points and always masks at least one.

### Localized display
Locale controls grouping patterns, currency placement, percent spacing and relative wording. Unit symbols preserve case; SI quantities use a space before the unit. Decimal precision fixes currency fractions and limits other numeric fractions. Display strings are not interchange timestamps. Exports include current valid configuration and specific guidance, not unselected editor options.
Machine contract: section rules, storage, units and acceptance
{
  "schemaVersion": 1,
  "authority": "Saved validated choices override project recommendations, which override system defaults. This implementation contract governs static specimens. Resolved tokens in the current export are authoritative values. Component exceptions must name the affected role and reason.",
  "governance": {
    "owners": "Design System Lead owns token and compatibility policy. Designers own specimens and interaction contracts. Developers own resolver/export/import parity. QA and Accessibility own release evidence. Product teams own domain-specific confidence, privacy and retention policies.",
    "changes": "Change the JSON contract first, regenerate documentation/defaults/catalog/tokens, then run model, DOM and recipient checks. Link the changed finding IDs and evidence in the release review.",
    "compatibility": "Keep hue-named CSS tokens as compatibility aliases while semantic consumers migrate. Additive tokens retain schemaVersion 1. A removed/renamed key or changed stored meaning requires a schema migration, a version bump and a documented replacement before release. Keep the prior reader fixture until the migration is verified.",
    "deprecation": "Record old key, replacement, reason, introduced version, planned removal version and affected consumers. Do not remove a token while an active consumer still uses it. Future records are preserved rather than coerced.",
    "scope": "This is a web design system with one shared workspace profile. Native dp/sp adaptation and real agent execution require separate adapters and acceptance. User-defined colors and responsive exceptions require product-specific rendered verification."
  },
  "storage": {
    "version": 1,
    "legacy": "Unversioned valid records migrate in memory. Typography headingScaleVersion 2 applies the smaller six-heading scale once to older records, retaining other roles and existing font/color/style metrics. Later custom size edits are retained. Unsupported future records are preserved. The next successful write stamps the migrated version.",
    "future": "Reject unsupported future versions. Preserve raw data. Offer backup and explicit reset.",
    "invalid": "Foundation selections preview locally until Save foundation succeeds. Saved Foundation editors require Edit foundation before changes. Cancel discards the preview. Invalid drafts never replace saved records; storage failures retain the editable preview and the last durable record.",
    "concurrency": "A storage event refreshes applied tokens and disables stale editor controls until reload. Never merge simultaneous edits silently."
  },
  "units": {
    "base": "1rem = 16px at default browser settings. Do not fix the root font size.",
    "use": "Prefer rem for typography, spacing and control dimensions. Hairline borders and viewport thresholds may use px. Both equivalents appear in Markdown. SVG strokes use viewBox units. Ratios, percentages, columns, timing and weights are unitless or retain their own units.",
    "native": "Web CSS px/rem are not native dp/sp. A native adapter must map semantic roles, support text scaling and test device density. Native rendering is not shipped by this web library."
  },
  "acceptance": [
    "Compare page, applied tokens, durable record, Machine View and exported instructions.",
    "Test valid, unfinished, invalid, missing, malformed, legacy and future records. Exercise storage failure, reset, reload and another tab.",
    "Test 320, 375, 768, 1024 and 1440px widths, 200% zoom, text-spacing overrides, RTL and long/localized labels.",
    "Use keyboard and screen reader. Confirm focus return, names, values, error associations and status announcements.",
    "Verify actual rendered text/surface pairs, forced colors, reduced motion, print and exported recipes in a recipient fixture. Source or DOM checks alone are not rendered acceptance."
  ],
  "layers": {
    "content": 0,
    "sticky": 20,
    "popover": 40,
    "scrim": 60,
    "dialog": 70,
    "toast": 80,
    "tooltip": 90,
    "rules": "Each overlay gets an explicit owner and close/focus-return path. Portal menus out of clipped scroll containers. Nested dialogs stack one scrim per modal owner. Escape closes the top dismissible layer. Tooltips never block actions. Test collision and zoom; do not infer stacking order from shadow size."
  },
  "section": {
    "title": "Data Format",
    "rules": {
      "Flow": "Configure a field, inspect its formatted example, copy/export current valid settings and reset/reload. Every valid input updates without blur. Invalid simultaneous fields all expose errors and retain the prior valid configuration.",
      "Constraints": "Decimal precision 0\u20136, trailing reveal 0\u20138, one Unicode code point for the mask, a supported locale and valid IANA zone. Explicit comma grouping cannot conflict with a comma decimal locale. Distinguish real zero, missing, invalid and loading. Never reveal the entire value through a tooltip or accessible name.",
      "Layout and accessibility": "Group number/currency, date/time and missing/sensitive settings with separators. Equal field heights and gutters, wrapped labels and responsive columns share the reference layout. Loading is announced once. Export the typed configuration and locale/zone/range/redaction rules.",
      "Value identity": "Apply numeric formatting to quantities, not IDs, phone numbers, postal codes or tracking references. Preserve leading zeros. Numeric table alignment applies only to numeric kinds. Date-only values retain their calendar day regardless of time zone. Ranges require two valid ordered dates; partial redaction counts Unicode code points and always masks at least one.",
      "Localized display": "Locale controls grouping patterns, currency placement, percent spacing and relative wording. Unit symbols preserve case; SI quantities use a space before the unit. Decimal precision fixes currency fractions and limits other numeric fractions. Display strings are not interchange timestamps. Exports include current valid configuration and specific guidance, not unselected editor options."
    }
  }
}

---

## Date Picker

Source: date-picker-default.html · Status: Available

Components · Forms · Date Picker
  Back to Date Picker types

# Date Picker
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
Use for entering or selecting a single calendar date, like a date of birth, a booking date, or a deadline - visually a text field with a fixed trailing calendar icon.

## Properties

Size, corner radius, label and placeholder are properties of the same component, not separate fields - change them below to check this field's style and states in the Live Preview.

        Size

        Corner radius

        Label

        Placeholder

        Allow clear

          × replaces icon once filled

        Date format
        
          MM/DD/YYYY
          DD/MM/YYYY
          YYYY-MM-DD
          DD MMM YYYY
          MMM DD, YYYY

        Required

          shows a required indicator

        Supporting text

          shown below the field

        Supporting text

        Error message

## Live Preview
    
Both types compared side by side, each in all 9 states - including Open, which shows the trigger's active-state styling (this system scopes to the trigger field itself; the calendar popover grid isn't modeled here). One full matrix is rendered per selected combination of Size and Corner radius - check more than one option in a dropdown to see every combination side by side.

## When to use
    
Any form field that collects a single calendar date rather than free-form text.

      Date of birth
      Booking date
      Deadline
      Event date
      Filter by date range

## Validation
    
Because the field accepts a typed date as well as a calendar pick, it needs to catch malformed and out-of-range dates that a picker-only field never sees.

- Required marking - mark the field required only when the date is mandatory to proceed, with the usual asterisk on the label, not a placeholder that disappears once the user starts typing.
      
- Validation timing - validate typed input on blur, not on every keystroke - checking as-you-type would flag an in-progress date like "12/2" as invalid before the user has finished typing it. A calendar selection is valid the moment it's clicked, since it can't produce a malformed value.
      
- Invalid date entry - reject a date that doesn't exist (e.g. "02/30/2026") or falls outside an allowed min/max range with a specific message - "February has only 28 days in 2026" or "Choose a date on or after 14 Mar 2026" - never a generic "Invalid date."
      
- Prevent, don't just catch - gray out and disable out-of-range dates in the calendar panel itself, so most invalid selections are avoided rather than caught only after the fact.
      
- Error message - show the message inline next to the field, and keep it specific enough that the user knows exactly what to change.

## Component Guide

        Human View
        Machine View

Overview
      
Date Picker is a text field with a fixed trailing calendar icon that opens a calendar panel for selecting a single date - it prevents free-form date typos and formatting inconsistencies by letting the user pick from an actual calendar instead of typing a date string by hand.

When to Use

- Collecting a single specific date - date of birth, a booking date, a deadline.
        
- Any date that benefits from calendar context - seeing the day of the week, nearby dates, or today's position.
        
- Filtering by a single date - "show records on this date".

When Not to Use

- A start and end date together as one pair - use Date Range instead of two separate Date Pickers.
        
- A time of day rather than a calendar date - use Time.
        
- A date the user would rather type freely in an unusual format - a plain Input may fit better for unconstrained historical or approximate dates.

Best Practices

- Show the selected date in the field using an unambiguous, locale-appropriate format (avoid all-numeric formats that can be misread as day/month vs. month/day).
        
- Default the calendar panel to open on today or on the currently selected date, not always the current month.
        
- Disable or visually de-emphasize out-of-range dates (past dates for a future booking, for example) rather than allowing an invalid selection to be corrected after the fact.

Do and Don't

Do

Delivery date
14 Mar 2026📅
Weekdays only.
          
An unambiguous written-out month, so the date reads the same to a reader in London and one in Chicago.

Don't

Delivery date
03/14/26📅
          
All-numeric dates flip meaning between locales - 03/04 is two different days depending on where the reader is. Spell the month out.

Accessibility

- The calendar panel is reachable and fully operable by keyboard (arrow keys to move between days, Enter to select, Escape to close).
        
- The current, focused, and selected day are each visually and programmatically distinguishable, not just by color.
        
- The field's accessible name states what date is being collected (e.g. "Date of birth"), not just "Date".

Related Components
      
Date Range, Time, Calendar (the always-visible grid this component's panel is based on), Input.

{
  "component": "Date Picker",
  "category": "Forms",
  "summary": "Date Picker is a text field with a fixed trailing calendar icon that opens a calendar panel for selecting a single date - it prevents free-form date typos and formatting inconsistencies by letting the user pick from an actual calendar instead of typing a date string by hand.",
  "whenToUse": [
    "Collecting a single specific date - date of birth, a booking date, a deadline.",
    "Any date that benefits from calendar context - seeing the day of the week, nearby dates, or today's position.",
    "Filtering by a single date - \"show records on this date\"."
  ],
  "whenNotToUse": [
    "A start and end date together as one pair - use Date Range instead of two separate Date Pickers.",
    "A time of day rather than a calendar date - use Time.",
    "A date the user would rather type freely in an unusual format - a plain Input may fit better for unconstrained historical or approximate dates."
  ],
  "bestPractices": [
    "Show the selected date in the field using an unambiguous, locale-appropriate format (avoid all-numeric formats that can be misread as day/month vs. month/day).",
    "Default the calendar panel to open on today or on the currently selected date, not always the current month.",
    "Disable or visually de-emphasize out-of-range dates (past dates for a future booking, for example) rather than allowing an invalid selection to be corrected after the fact."
  ],
  "doAndDont": {
    "do": "An unambiguous written-out month, so the date reads the same to a reader in London and one in Chicago.",
    "dont": "All-numeric dates flip meaning between locales - 03/04 is two different days depending on where the reader is. Spell the month out."
  },
  "accessibility": [
    "The calendar panel is reachable and fully operable by keyboard (arrow keys to move between days, Enter to select, Escape to close).",
    "The current, focused, and selected day are each visually and programmatically distinguishable, not just by color.",
    "The field's accessible name states what date is being collected (e.g. \"Date of birth\"), not just \"Date\"."
  ],
  "relatedComponents": [
    "Date Range",
    "Time",
    "Calendar",
    "Input"
  ]
}

---

## Date Picker

Source: date-picker.html · Status: Available

Components · Forms

# Date Picker
  
A form control for entering or selecting a calendar date - a text field with a fixed trailing calendar icon, in Outlined and Filled styles across six states.

## Date Picker type

Copy a ready-to-paste AI prompt or the working code - both use this system's own color tokens and Inter, never arbitrary values. Click the card to configure it in full.

            Date of birth

              MM/DD/YYYY

Date Picker

          Copy prompt

---

## Date Range

Source: date-range-default.html · Status: Available

Components · Forms · Date Range
  Back to Date Range types

# Date Range
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
Use for picking a start and end date together as one pair, like trip dates or a reporting period, instead of two separate date fields - visually a text field showing both dates with a fixed trailing calendar icon.

## Properties

Size, corner radius, label and placeholders are properties of the same component, not separate fields - change them below to check this field's style and states in the Live Preview.

        Size

        Corner radius

        Label

        Start placeholder

        End placeholder

        Allow clear

          × replaces icon once filled

        Required

          shows a required indicator

        Supporting text

          shown below the field

        Supporting text

        Error message

## Live Preview
    
Both types compared side by side, each in all 9 states. One full matrix is rendered per selected combination of Size and Corner radius - check more than one option in a dropdown to see every combination side by side.

## When to use
    
Any form field that collects a start and end date together as one bounded pair rather than two independent dates.

      Trip dates
      Reporting period
      Booking window
      Subscription term
      Event duration

## Validation
    
Two connected dates mean two layers of validation - each end's own date has to be valid, and the pair has to be validated together for order.

- Required marking - mark the field required when the range as a whole is mandatory; state on the label or nearby copy whether both ends or just the start are required, since "required" is ambiguous on a two-part field.
      
- Validation timing - validate each end's own date validity on blur, but only check the start-before-end relationship once both ends have a value. Checking it right after the start is filled would incorrectly flag an incomplete range as an error.
      
- Invalid date entry - a malformed or out-of-range date in either field is rejected with the same specific messaging as Date Picker (e.g. "February has only 28 days in 2026"), scoped to whichever end produced it.
      
- Range order - if the end date lands before the start date, show "End date must be on or after the start date." Prevent most of these outright by disabling dates before the start in the end-date calendar once a start is chosen, or auto-adjusting the other end.
      
- Error message - show the message inline, next to whichever segment (start or end) it applies to, so the user isn't left guessing which half of the range is wrong.

## Component Guide

        Human View
        Machine View

Overview
      
Date Range collects a start and end date together as one bounded pair in a single field - a text field showing both dates with a fixed trailing calendar icon - used whenever the two dates are meaningless apart, like a trip's start and end.

When to Use

- Trip or booking dates - start and end, considered together.
        
- A reporting period or subscription term - a bounded window with a clear start and end.
        
- An event's duration - where showing just one date without the other would be incomplete.

When Not to Use

- Two genuinely independent dates - use two separate Date Pickers if the dates don't form one bounded range.
        
- A single date with no end boundary - use Date Picker.
        
- A numeric range rather than a date range - use Slider or two Number fields.

Best Practices

- Show both dates together in the field so the pair reads as one value, not two.
        
- Prevent selecting an end date before the start date directly in the calendar UI, rather than only validating after submission.
        
- Highlight the in-between days in the calendar panel while the user is choosing the range, so the selection reads clearly before it's confirmed.

Do and Don't

Do

Reporting period
1 Jan 2026→31 Mar 2026📅
          
One control holding both ends, so the pair is obviously a range and cannot be filled in the wrong order.

Don't

From
31 Mar 2026📅
To
1 Jan 2026📅
End date is before start date.
          
Two independent Date Pickers let the user build an impossible range and only find out when they submit.

Accessibility

- Announces which end of the range (start or end) is currently being selected as the user moves through the calendar.
        
- Fully keyboard-operable, matching Date Picker's arrow-key and Enter/Escape behavior, extended across two linked selections.
        
- The field's accessible name or nearby label clarifies that a range, not a single date, is being collected.

Related Components
      
Date Picker, Calendar, Time.

{
  "component": "Date Range",
  "category": "Forms",
  "summary": "Date Range collects a start and end date together as one bounded pair in a single field - a text field showing both dates with a fixed trailing calendar icon - used whenever the two dates are meaningless apart, like a trip's start and end.",
  "whenToUse": [
    "Trip or booking dates - start and end, considered together.",
    "A reporting period or subscription term - a bounded window with a clear start and end.",
    "An event's duration - where showing just one date without the other would be incomplete."
  ],
  "whenNotToUse": [
    "Two genuinely independent dates - use two separate Date Pickers if the dates don't form one bounded range.",
    "A single date with no end boundary - use Date Picker.",
    "A numeric range rather than a date range - use Slider or two Number fields."
  ],
  "bestPractices": [
    "Show both dates together in the field so the pair reads as one value, not two.",
    "Prevent selecting an end date before the start date directly in the calendar UI, rather than only validating after submission.",
    "Highlight the in-between days in the calendar panel while the user is choosing the range, so the selection reads clearly before it's confirmed."
  ],
  "doAndDont": {
    "do": "One control holding both ends, so the pair is obviously a range and cannot be filled in the wrong order.",
    "dont": "Two independent Date Pickers let the user build an impossible range and only find out when they submit."
  },
  "accessibility": [
    "Announces which end of the range (start or end) is currently being selected as the user moves through the calendar.",
    "Fully keyboard-operable, matching Date Picker's arrow-key and Enter/Escape behavior, extended across two linked selections.",
    "The field's accessible name or nearby label clarifies that a range, not a single date, is being collected."
  ],
  "relatedComponents": [
    "Date Picker",
    "Calendar",
    "Time"
  ]
}

---

## Date Range

Source: date-range.html · Status: Available

Components · Forms

# Date Range
  
A form control for picking a start and end date together as one pair - a text field showing both dates with a fixed trailing calendar icon, in Outlined and Filled styles across six states, for things like trip dates or a reporting period.

## Date Range type

Copy a ready-to-paste AI prompt or the working code - both use this system's own color tokens and Inter, never arbitrary values. Click the card to configure it in full.

            Trip dates

              Jan 4, 2026→Jan 9, 2026

Date Range

          Copy prompt

---

## Description

Source: description-default.html · Status: Available

Components · Data Display · Description
  Back to Description types

# Description
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
Use to display a set of structured details at a glance, like a summary panel - one Description component, controlled by properties, not a one-off table hacked together per screen.

## Properties

Description has no hover/focus/disabled states - it is not interactive. Section title below only applies to the With title state; the other states ignore it. Change Columns to check every type and state in the Live Preview at 1, 2 or 3 columns.

        Columns
        
          1
          2
          3

        Section title

        Size

## Live Preview
    
Both types compared side by side, each in 3 states - Compact, With title and Long value. One matrix is rendered per selected Size, at the chosen Columns count.

## When to use
    
Any place a fixed set of read-only structured details needs to be shown at a glance, not edited inline.

      User profile summary
      Order confirmation details
      Account settings overview
      Product specification sheet
      Support ticket metadata

## Component Guide

        Human View
        Machine View

Overview
      
Description displays a set of structured details at a glance, like a summary panel - label/value pairs arranged in a configurable grid of columns, used for read-only structured details rather than an editable form.

When to Use

- A user profile summary - showing a set of fixed attributes at a glance.
        
- Order confirmation details or account settings overview - a read-only recap of structured data.
        
- A product specification sheet or support ticket metadata - label/value pairs that don't need editing in place.

When Not to Use

- Data the user needs to edit directly - use the appropriate form fields (Input, Select, etc.) instead of read-only Description.
        
- A single flat list of similar items rather than distinct labeled attributes - use List.
        
- Tabular data with many rows sharing the same columns - use Table instead of repeating Description panels.

Best Practices

- Choose a column count that keeps label/value pairs readable without excessive line wrapping.
        
- Keep labels short and consistent in tone (all nouns, or all short phrases) across every field in the panel.
        
- Group related fields visually, with an optional section title, when the panel covers more than one topic.

Do and Don't

Do

StatusActive
Renewal date14 Mar 2026
          
Short labels paired with short values in a scannable grid - exactly what Description is for, a record's fixed fields laid out at a glance.

Don't

NotesCustomer called on the 3rd to ask about upgrading their plan, was transferred twice, eventually resolved by billing on the 5th.
          
A paragraph forced into a label/value row breaks the grid's alignment for every other field. Long-form content belongs in a Card or a text block, not a Description grid.

Accessibility

- Implemented with real term/description semantics (or an equivalent structure) so the label-value relationship is explicit to assistive technology, not just visual proximity.
        
- Long values wrap or truncate with a way to see the full value, rather than silently cutting text off with no indication.
        
- Section titles are real headings, not styled text with no semantic weight.

Related Components
      
Card, Table, List.

{
  "component": "Description",
  "category": "Data Display",
  "summary": "Description displays a set of structured details at a glance, like a summary panel - label/value pairs arranged in a configurable grid of columns, used for read-only structured details rather than an editable form.",
  "whenToUse": [
    "A user profile summary - showing a set of fixed attributes at a glance.",
    "Order confirmation details or account settings overview - a read-only recap of structured data.",
    "A product specification sheet or support ticket metadata - label/value pairs that don't need editing in place."
  ],
  "whenNotToUse": [
    "Data the user needs to edit directly - use the appropriate form fields (Input, Select, etc.) instead of read-only Description.",
    "A single flat list of similar items rather than distinct labeled attributes - use List.",
    "Tabular data with many rows sharing the same columns - use Table instead of repeating Description panels."
  ],
  "bestPractices": [
    "Choose a column count that keeps label/value pairs readable without excessive line wrapping.",
    "Keep labels short and consistent in tone (all nouns, or all short phrases) across every field in the panel.",
    "Group related fields visually, with an optional section title, when the panel covers more than one topic."
  ],
  "doAndDont": {
    "do": "Short labels paired with short values in a scannable grid - exactly what Description is for, a record's fixed fields laid out at a glance.",
    "dont": "A paragraph forced into a label/value row breaks the grid's alignment for every other field. Long-form content belongs in a Card or a text block, not a Description grid."
  },
  "accessibility": [
    "Implemented with real term/description semantics (or an equivalent structure) so the label-value relationship is explicit to assistive technology, not just visual proximity.",
    "Long values wrap or truncate with a way to see the full value, rather than silently cutting text off with no indication.",
    "Section titles are real headings, not styled text with no semantic weight."
  ],
  "relatedComponents": [
    "Card",
    "Table",
    "List"
  ]
}

---

## Description

Source: description.html · Status: Available

Components · Data Display

# Description
  
A read-only label/value grid for showing a set of structured details at a glance, like a summary panel.

## Description type

Copy a ready-to-paste AI prompt or the working code - both use this system's own color tokens and Inter, never arbitrary values. Click the card to configure it in full.

                Name
                Jordan Lee

                Status
                Active

                Email
                jordan@example.com

                Role
                Admin

System Control

          Copy prompt

---

## Divider

Source: divider-default.html · Status: Available

Components · Data Display · Divider
  Back to Divider types

# Divider
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
Use to visually separate sections of content with a horizontal rule, with an optional text label breaking the line - one Divider component, controlled by properties, not a one-off <hr> or border hack rebuilt per screen.

## Properties

Divider has no hover/focus/disabled states - it is not interactive. Text label and Text alignment below only visibly apply to the Horizontal with text form; the other forms ignore them. Change them below to check every form and line style in the Live Preview.

        Text label

        Text alignment
        
          Left
          Center
          Right

        Size

## Live Preview
    
All 3 forms compared side by side, each in 3 line styles - Solid, Dashed and Dotted. One matrix is rendered per selected Size, at the chosen Text label and Text alignment.

## When to use
    
Any place content needs a clear, low-emphasis break - between sections, form groups, or inline items in a row.

      Section separator
      Form group boundary
      "Or" split between actions
      Breadcrumb-adjacent separator
      List item separator

## Component Guide

        Human View
        Machine View

Overview
      
Divider visually separates sections of content with a horizontal rule, with an optional text label breaking the line - a lightweight, low-emphasis break between related but distinct groups of content.

When to Use

- A section separator - marking a clear boundary between two content blocks.
        
- A form group boundary or an "Or" split between two actions - e.g. "Sign in with email" / "Or" / "Continue with Google".
        
- A separator between inline items - adjacent to a Breadcrumb, or between items in a row.

When Not to Use

- Spacing alone would already communicate the separation - don't add a visible line where whitespace is sufficient - overusing dividers adds visual clutter.
        
- A boundary that also needs to be interactive or collapsible - use Collapse instead of a plain static Divider.
        
- Separating truly unrelated content that shouldn't appear together at all - a Divider implies related-but-distinct groups; unrelated content belongs on separate pages or panels.

Best Practices

- Use a labeled Divider (with text) only when the label adds real information ("Or"), not as decoration.
        
- Keep its weight and color subtle - a Divider should recede, not compete with the content it separates.

Do and Don't

Do

Personal details

Billing details
          
Marks a real boundary between two distinct groups of fields, so the eye knows where one section ends.

Don't

First name

Last name

Email
          
A divider between every single field turns a short form into a fence of lines, drowning out the one grouping boundary that would actually help.

Accessibility

- Purely decorative in most cases, so it's hidden from assistive technology rather than announced as content.
        
- When it also carries a semantic heading-like label, that label is exposed as real text, not baked into a background image.
        
- Never used as the sole way to convey a structural boundary that should really be a heading or landmark.

Related Components
      
Card, Collapse, Description.

{
  "component": "Divider",
  "category": "Data Display",
  "summary": "Divider visually separates sections of content with a horizontal rule, with an optional text label breaking the line - a lightweight, low-emphasis break between related but distinct groups of content.",
  "whenToUse": [
    "A section separator - marking a clear boundary between two content blocks.",
    "A form group boundary or an \"Or\" split between two actions - e.g. \"Sign in with email\" / \"Or\" / \"Continue with Google\".",
    "A separator between inline items - adjacent to a Breadcrumb, or between items in a row."
  ],
  "whenNotToUse": [
    "Spacing alone would already communicate the separation - don't add a visible line where whitespace is sufficient - overusing dividers adds visual clutter.",
    "A boundary that also needs to be interactive or collapsible - use Collapse instead of a plain static Divider.",
    "Separating truly unrelated content that shouldn't appear together at all - a Divider implies related-but-distinct groups; unrelated content belongs on separate pages or panels."
  ],
  "bestPractices": [
    "Use a labeled Divider (with text) only when the label adds real information (\"Or\"), not as decoration.",
    "Keep its weight and color subtle - a Divider should recede, not compete with the content it separates."
  ],
  "doAndDont": {
    "do": "Marks a real boundary between two distinct groups of fields, so the eye knows where one section ends.",
    "dont": "A divider between every single field turns a short form into a fence of lines, drowning out the one grouping boundary that would actually help."
  },
  "accessibility": [
    "Purely decorative in most cases, so it's hidden from assistive technology rather than announced as content.",
    "When it also carries a semantic heading-like label, that label is exposed as real text, not baked into a background image.",
    "Never used as the sole way to convey a structural boundary that should really be a heading or landmark."
  ],
  "relatedComponents": [
    "Card",
    "Collapse",
    "Description"
  ]
}

---

## Divider

Source: divider.html · Status: Available

Components · Data Display

# Divider
  
A thin horizontal rule that visually separates content, with an optional text label breaking the line.

## Divider type

Copy a ready-to-paste AI prompt or the working code - both use this system's own color tokens and Inter, never arbitrary values. Click the card to configure it in full.

Sign in with your work email and password to continue.

              OR

Continue with single sign-on (SSO) instead.

System Control

          Copy prompt

---

## Drawer

Source: drawer-default.html · Status: Available

Components · Feedback · Drawer
  Back to Drawer types

# Drawer
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
Use for a panel that slides in from a screen edge above a dimmed backdrop, for tasks that need more room than a Modal but shouldn't fully interrupt the page layout - one Drawer component, controlled by properties, not a one-off overlay built from scratch each time.

## Properties

Size, corner radius, title, body text and the close button are properties of the same component, not separate panels glued together - change them below to check this drawer's style and states in the Live Preview.

        Size
        
          Small
          Medium
          Large

        Corner radius

        Title

        Heading level
        
          H1
          H2
          H3
          H4
          H5
          H6

        Body

        Show close button

          shown in the title bar

## Live Preview
    
All 4 placements compared side by side, each in all 3 structural states, at the chosen Size, title and body text - Size controls width on Left/Right and height on Top/Bottom. One full matrix is rendered per selected Corner radius.

## When to use
    
Any moment that needs more room than a Modal but shouldn't fully interrupt the page layout behind it.

      Edit-in-place panel
      Filter/settings side panel
      Detail preview without leaving the list
      Multi-step form in a focused flow
      Notification center panel

## Component Guide

        Human View
        Machine View

Overview
      
Drawer is a panel that slides in from a screen edge above a dimmed backdrop, for tasks that need more room than a Modal but shouldn't fully interrupt the page layout behind it - the page stays visible and contextually present at the edge, unlike Modal's fully centered takeover.

When to Use

- An edit-in-place panel - editing a record's details without leaving the list behind it.
        
- A filter or settings side panel - adjusting options while keeping the underlying content in view.
        
- A detail preview or a multi-step form that needs more room than a dialog - still tied to the specific context it opened from.

When Not to Use

- A short, focused decision or confirmation - use Modal - Drawer's larger size is unnecessary weight for a quick yes/no.
        
- Content meant to persist as part of the page's normal layout - use a permanent panel or sidebar rather than a Drawer that must be explicitly opened and closed.
        
- A brief, non-blocking status update - use Toast or Notification instead of a full sliding panel.

Best Practices

- Keep the underlying page visible and dimmed, not hidden, so context isn't lost while the Drawer is open.
        
- Choose a consistent edge (commonly the right) for a given type of task across the product.
        
- Warn before closing a Drawer with unsaved changes, the same way you would for a Modal.

Do and Don't

Do

Filters

Status, owner and date range - applied to the list still visible behind.
          
A side task with enough substance to fill the panel, kept beside the list it acts on rather than covering it.

Don't

Discard draft?
CancelDiscard
          
A one-line confirmation leaves most of the panel empty and still blocks the page to slide in. Use Modal or Pop Confirm when there is only a question to ask.

Accessibility

- Traps keyboard focus within the panel while open, and restores it to the triggering element on close, matching Modal's behavior.
        
- Exposed as role="dialog" with aria-modal="true" and an accessible name (its title via aria-labelledby), announced as it opens - like Modal, this is focus management and an interrupting dialog, not a passive aria-live announcement.
        
- Escape and a visible close control are both always available, regardless of what task is in progress inside it.

Related Components
      
Modal, Popover, Steps.

{
  "component": "Drawer",
  "category": "Feedback",
  "summary": "Drawer is a panel that slides in from a screen edge above a dimmed backdrop, for tasks that need more room than a Modal but shouldn't fully interrupt the page layout behind it - the page stays visible and contextually present at the edge, unlike Modal's fully centered takeover.",
  "whenToUse": [
    "An edit-in-place panel - editing a record's details without leaving the list behind it.",
    "A filter or settings side panel - adjusting options while keeping the underlying content in view.",
    "A detail preview or a multi-step form that needs more room than a dialog - still tied to the specific context it opened from."
  ],
  "whenNotToUse": [
    "A short, focused decision or confirmation - use Modal - Drawer's larger size is unnecessary weight for a quick yes/no.",
    "Content meant to persist as part of the page's normal layout - use a permanent panel or sidebar rather than a Drawer that must be explicitly opened and closed.",
    "A brief, non-blocking status update - use Toast or Notification instead of a full sliding panel."
  ],
  "bestPractices": [
    "Keep the underlying page visible and dimmed, not hidden, so context isn't lost while the Drawer is open.",
    "Choose a consistent edge (commonly the right) for a given type of task across the product.",
    "Warn before closing a Drawer with unsaved changes, the same way you would for a Modal."
  ],
  "doAndDont": {
    "do": "A side task with enough substance to fill the panel, kept beside the list it acts on rather than covering it.",
    "dont": "A one-line confirmation leaves most of the panel empty and still blocks the page to slide in. Use Modal or Pop Confirm when there is only a question to ask."
  },
  "accessibility": [
    "Traps keyboard focus within the panel while open, and restores it to the triggering element on close, matching Modal's behavior.",
    "Exposed as role=\"dialog\" with aria-modal=\"true\" and an accessible name (its title via aria-labelledby), announced as it opens - like Modal, this is focus management and an interrupting dialog, not a passive aria-live announcement.",
    "Escape and a visible close control are both always available, regardless of what task is in progress inside it."
  ],
  "relatedComponents": [
    "Modal",
    "Popover",
    "Steps"
  ]
}

---

## Drawer

Source: drawer.html · Status: Available

Components · Feedback

# Drawer
  
A panel that slides in from a screen edge above a dimmed backdrop, for tasks that need more room than a Modal but shouldn't fully interrupt the page layout - stays anchored flush against the edge instead of floating centered.

## Drawer type

Copy a ready-to-paste AI prompt or the working code - both use this system's own color tokens and Inter, never arbitrary values. Click the card to configure it in full.

                Edit profile
                ×

Update your name, photo, and contact details.

                Cancel
                Save

System Control

          Copy prompt

---

## Dropdown

Source: dropdown-default.html · Status: Available

Components · Navigation · Dropdown
  Back to Dropdown types

# Dropdown
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
A trigger button that reveals a list of actions or commands when clicked, like "More actions" or "Sort by" - distinct from Select, which picks a form value, and from the menu panel it opens.

## Properties

Size, corner radius and label are properties of the same component, not separate buttons - change them below to check this trigger's style and states in the Live Preview.

        Size

        Corner radius

        Label

## Live Preview
    
Both types compared side by side, each in all 7 states. One full matrix is rendered per selected combination of Size and Corner radius - check more than one option in a dropdown to see every combination side by side.

## Interactive Example
    
A real, working Dropdown - not just an illustration of what each state looks like. Click the trigger (or focus it and press Enter, Space or ArrowDown), use arrow keys to move through the menu, Enter or Space to choose an item, and Escape or a click outside to close. Follows the Size, Corner radius and Label controls above.

## When to use
    
Any button that opens a list of clickable commands or actions - never for picking a form value, which is what Select is for.

      Row actions menu
      Bulk actions
      Sort by
      More options

## Component Guide

        Human View
        Machine View

Overview
      
Dropdown is a trigger button that reveals a list of actions or commands when clicked, like "More actions" or "Sort by" - distinct from Select, which picks a form value, and from the Menu panel it opens, which is a separate component in its own right.

When to Use

- A row-level actions menu - opening a list of commands for a single table row.
        
- A bulk-actions or sort-by trigger - acting on multiple selected items, or choosing a sort order from a command list.
        
- A catch-all "more options" trigger - when several secondary actions don't fit as individual buttons.

When Not to Use

- Picking a value that gets stored or submitted as form data - use Select - Dropdown triggers actions, it doesn't hold a form value.
        
- A single, common action that deserves its own visible button - don't bury a frequently-used action inside a Dropdown just to reduce button count.
        
- Persistent, always-visible navigation - use a nav bar, sidebar, or Tabs instead of hiding primary navigation behind a click.

Best Practices

- Order menu items by frequency of use or logical grouping, with destructive actions visually separated at the bottom.
        
- Keep the trigger's label descriptive ("Sort by", not just an icon) unless the icon convention is already well established.
        
- Close the menu on selection, on outside click, and on Escape - never leave it open after an action fires.

Do and Don't

Do

Sort by: Newest▾
          
The trigger states the current selection, so the control still reads correctly closed, without needing to be opened first.

Don't

Options▾
          
A generic "Options" label never reflects what has actually been chosen, so the user has to reopen the menu just to check the current state.

Accessibility

- The trigger exposes aria-haspopup and aria-expanded, reflecting whether the menu is currently open.
        
- The opened menu is fully keyboard-navigable (arrow keys, Enter to activate, Escape to close) without requiring a mouse.
        
- Focus returns to the trigger when the menu closes, so keyboard users don't lose their place.

Related Components
      
Menu (the panel it opens), Select, Button.

{
  "component": "Dropdown",
  "category": "Navigation",
  "summary": "Dropdown is a trigger button that reveals a list of actions or commands when clicked, like \"More actions\" or \"Sort by\" - distinct from Select, which picks a form value, and from the Menu panel it opens, which is a separate component in its own right.",
  "whenToUse": [
    "A row-level actions menu - opening a list of commands for a single table row.",
    "A bulk-actions or sort-by trigger - acting on multiple selected items, or choosing a sort order from a command list.",
    "A catch-all \"more options\" trigger - when several secondary actions don't fit as individual buttons."
  ],
  "whenNotToUse": [
    "Picking a value that gets stored or submitted as form data - use Select - Dropdown triggers actions, it doesn't hold a form value.",
    "A single, common action that deserves its own visible button - don't bury a frequently-used action inside a Dropdown just to reduce button count.",
    "Persistent, always-visible navigation - use a nav bar, sidebar, or Tabs instead of hiding primary navigation behind a click."
  ],
  "bestPractices": [
    "Order menu items by frequency of use or logical grouping, with destructive actions visually separated at the bottom.",
    "Keep the trigger's label descriptive (\"Sort by\", not just an icon) unless the icon convention is already well established.",
    "Close the menu on selection, on outside click, and on Escape - never leave it open after an action fires."
  ],
  "doAndDont": {
    "do": "The trigger states the current selection, so the control still reads correctly closed, without needing to be opened first.",
    "dont": "A generic \"Options\" label never reflects what has actually been chosen, so the user has to reopen the menu just to check the current state."
  },
  "accessibility": [
    "The trigger exposes aria-haspopup and aria-expanded, reflecting whether the menu is currently open.",
    "The opened menu is fully keyboard-navigable (arrow keys, Enter to activate, Escape to close) without requiring a mouse.",
    "Focus returns to the trigger when the menu closes, so keyboard users don't lose their place."
  ],
  "relatedComponents": [
    "Menu",
    "Select",
    "Button"
  ]
}

---

## Dropdown

Source: dropdown.html · Status: Available

Components · Navigation

# Dropdown
  
A trigger button that reveals a list of actions or commands when clicked - visually a button, not a form field, and distinct from Select, which picks a form value from a fixed list.

## Dropdown type

Copy a ready-to-paste AI prompt or the working code - both use this system's own color tokens and Inter, never arbitrary values. Click the card to configure it in full.

            Options

Dropdown Trigger

          Copy prompt

---

## Empty

Source: empty-default.html · Status: Available

Components · Data Display · Empty
  Back to Empty types

# Empty
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
Use whenever a list, table, or search result has no data to show, so the space reads as intentionally empty rather than broken - one Empty component, controlled by properties, not a one-off blank div left behind.

## Properties

Title, description and action label are properties of the same component, not separate placeholders - change them below to check both icon styles and all 3 states in the Live Preview.

        Title

        Description

        Action label

## Live Preview
    
Both icon styles compared side by side, each in all 3 states - Title only, With description, and With description and an action button. The action button only appears in the With action state, using the current Action label.

## When to use
    
Any time a list, table, or search has nothing to show, so the space never looks broken or blank.

      Empty search results
      New/unused feature area
      Empty inbox or notifications
      No data in a table
      Empty shopping cart

## Component Guide

        Human View
        Machine View

Overview
      
Empty stands in whenever a list, table, or search result has no data to show, so the space reads as intentionally empty rather than broken - an icon, a title, an optional description, and an optional action to resolve the empty state.

When to Use

- A search with no matching results - explaining that nothing matched, not leaving a blank area.
        
- A brand-new or unused feature area - before the user has created their first item.
        
- An empty inbox, notification list, or shopping cart - any collection with genuinely zero items.

When Not to Use

- Content that's still loading - use Skeleton or Spin - Empty means "confirmed nothing here," not "still checking."
        
- An error that prevented data from loading at all - use Result or an explicit error message - a failed fetch isn't the same as a legitimately empty result.
        
- A brief, non-blocking status update - use Toast or Alert instead of a full empty-state panel for something transient.

Best Practices

- Explain why the space is empty and, when possible, what the user can do about it (e.g. "No results - try a different search").
        
- Offer a direct action to resolve the state when one exists ("Create your first project"), not just a passive message.
        
- Keep the tone matter-of-fact rather than apologetic - an empty state is often a normal, expected condition, not a failure.

Do and Don't

Do

No invoices yet
Invoices you send will show up here.Create invoice
          
Explains why the space is blank and offers the one action that would fill it, rather than leaving a dead end.

Don't

No data
          
"No data" does not say whether that is because nothing has happened yet, a filter is hiding everything, or something failed - three states that each need a different message.

Accessibility

- The message is real text, not baked into an illustration, so screen readers can announce it.
        
- Any resolving action is a real, keyboard-operable control, not just a static graphic.
        
- Decorative illustrations are marked so assistive technology doesn't announce them as meaningful content.

Related Components
      
Result, Skeleton, List.

{
  "component": "Empty",
  "category": "Data Display",
  "summary": "Empty stands in whenever a list, table, or search result has no data to show, so the space reads as intentionally empty rather than broken - an icon, a title, an optional description, and an optional action to resolve the empty state.",
  "whenToUse": [
    "A search with no matching results - explaining that nothing matched, not leaving a blank area.",
    "A brand-new or unused feature area - before the user has created their first item.",
    "An empty inbox, notification list, or shopping cart - any collection with genuinely zero items."
  ],
  "whenNotToUse": [
    "Content that's still loading - use Skeleton or Spin - Empty means \"confirmed nothing here,\" not \"still checking.\"",
    "An error that prevented data from loading at all - use Result or an explicit error message - a failed fetch isn't the same as a legitimately empty result.",
    "A brief, non-blocking status update - use Toast or Alert instead of a full empty-state panel for something transient."
  ],
  "bestPractices": [
    "Explain why the space is empty and, when possible, what the user can do about it (e.g. \"No results - try a different search\").",
    "Offer a direct action to resolve the state when one exists (\"Create your first project\"), not just a passive message.",
    "Keep the tone matter-of-fact rather than apologetic - an empty state is often a normal, expected condition, not a failure."
  ],
  "doAndDont": {
    "do": "Explains why the space is blank and offers the one action that would fill it, rather than leaving a dead end.",
    "dont": "\"No data\" does not say whether that is because nothing has happened yet, a filter is hiding everything, or something failed - three states that each need a different message."
  },
  "accessibility": [
    "The message is real text, not baked into an illustration, so screen readers can announce it.",
    "Any resolving action is a real, keyboard-operable control, not just a static graphic.",
    "Decorative illustrations are marked so assistive technology doesn't announce them as meaningful content."
  ],
  "relatedComponents": [
    "Result",
    "Skeleton",
    "List"
  ]
}

---

## Empty

Source: empty.html · Status: Available

Components · Data Display

# Empty
  
A placeholder shown when a list, table, or search has no data to display, so the space never looks broken or blank.

## Empty type

Copy a ready-to-paste AI prompt or the working code - both use this system's own color tokens and Inter, never arbitrary values. Click the card to configure it in full.

No projects yet
            
Create your first project to get started.
            Create project

System Control

          Copy prompt

---

## Figma

Source: figma.html · Status: Available

Components · Integration

# Figma
Synchronize versioned component contracts with a local Figma development plugin.

## Start the bridge
- In this project folder, run node tools/component-bridge.cjs.
- Open Component Contract Editor through http://127.0.0.1:3333/component-editor.html, or open a component guide and select Edit component contract.
- Build the supplied plugin with node tools/build_figma_plugin.cjs. In Figma Desktop, import figma-plugin/manifest.json as a development plugin and run Contract Bridge. If Figma assigns a development plugin ID, retain that ID in the manifest.
- Save a component revision with Contract as the authoring source. Select Push contract to Figma. Success is reported only after the plugin completes the request.

## Edit, compare and pull
Existing component masters and anatomy parts are matched by stable IDs and updated in place. Removed variants remain hidden so their existing instances stay linked. Changed part kinds can require override review; the plugin reports these cases.
- To make Figma lead, edit the contract's Authoring source and save it.
- Edit the linked component set on the current Figma page. To import an existing library component, select its editable local master or component set before pulling.
- Select Pull from Figma as draft. Review the property and part differences, then Save component to create a new revision.
Web callbacks, application data and CSS animation are implementation behavior. Figma represents authored visual variants; it does not execute application callbacks. Inspect the plugin's warnings for missing fonts, instance mappings or unsupported properties.

## Tokens and library references
The adapter binds exact token references to matching local variables. Explicit library variable keys can be supplied under adapters.figma.variableMap; nested component IDs or library keys go under adapters.figma.components. Unmapped tokens are created in a plugin-owned Contract Tokens collection. Existing library variable values are preserved.
The authoring specification is component-contract.schema.json. The adapter handles common auto-layout, text, color, border and radius values. Verify the rendered result in your actual Figma library, particularly complex SVGs, slots and instance overrides.

## Connection and recovery
The bridge uses local port 3333. Keep its terminal and the Figma plugin open. If a job times out, the editor reports failure rather than claiming the component was drawn. Drafts and saved contracts remain in your browser; exported JSON is the portable backup. Unsupported schema versions and stale revisions are rejected.

---

## Float Button

Source: float-button-default.html · Status: Available

Components · Actions · Float Button
  Back to Float Button types

# Float Button
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
Use for a persistent, always-accessible primary action anchored to a screen corner, like "back to top", "compose", or "customer support" - icon-only, with an optional badge dot and a tooltip label on hover, not a substitute for regular inline Buttons.

## Properties

Size, tooltip text and badge visibility are properties of the same component, not separate buttons - change them below to check this button's style and states in the Live Preview.

        Size

        Elevation
        
          None
          Subtle
          Medium
          High

        Supporting text

        Tooltip

          shown on hover/focus

        Tooltip text

        Tooltip placement
        
          Top
          Bottom
          Left
          Right

        Badge

          shown in the corner

        Badge type
        
          Dot
          Count

        Badge count

        Badge max count

## Live Preview
    
All 3 types compared side by side, each in all 4 states. One full matrix is rendered per selected Size, at the chosen tooltip text and badge visibility.

## When to use
    
Any persistent, always-accessible primary action anchored to a screen corner.

      Back to top
      Compose new item
      Customer support launcher
      Primary page action
      Quick add

## Component Guide

        Human View
        Machine View

Overview
      
Float Button is a persistent, icon-only action anchored to a fixed corner of the screen, used for a single always-accessible action a user might need regardless of scroll position or context - distinct from an inline Button, which lives within the page's normal content flow.

When to Use

- A persistent utility action - Back to top, Compose new item.
        
- A support or help launcher - a customer support chat entry point.
        
- A single primary page action that should stay reachable while scrolling - Quick add.

When Not to Use

- Multiple competing floating actions on one screen - pick the single truly persistent action; route the rest through a menu or inline buttons.
        
- An action that already exists inline on the page - don't duplicate it as a float - that just adds visual noise.
        
- Complex, multi-step actions - a Float Button should trigger something simple or open another surface (Modal, Drawer) - it shouldn't carry the whole flow itself.

Best Practices

- Use exactly one Float Button per screen so it stays meaningfully "the" persistent action.
        
- Choose an icon that is universally recognizable without a label (a plus, an upward arrow, a chat bubble).
        
- Reserve the badge dot for a real unread/pending count, not decoration.
        
- Always pair it with a tooltip, since the control itself carries no visible text.

Do and Don't

Do
          
+
          
Exactly one floating action, so it reliably means "the persistent thing you can always do here".

Don't
          
+✉⚙
          
A stack of floating buttons covers the content it floats over and turns a clear affordance into a second navigation bar.

Accessibility

- Icon-only, so it needs an explicit aria-label naming the action - there is no visible text to fall back on.
        
- The tooltip is a supplementary visual hint, not a substitute for the accessible name.
        
- Keeps a full-size touch target even though it's visually compact, meeting WCAG 2.2 target-size guidance.

Related Components
      
Primary Button, Dropdown (when the floating action opens a menu of several actions), Tooltip (its hover label), Badge (its notification dot).

{
  "component": "Float Button",
  "category": "Actions",
  "summary": "Float Button is a persistent, icon-only action anchored to a fixed corner of the screen, used for a single always-accessible action a user might need regardless of scroll position or context - distinct from an inline Button, which lives within the page's normal content flow.",
  "whenToUse": [
    "A persistent utility action - Back to top, Compose new item.",
    "A support or help launcher - a customer support chat entry point.",
    "A single primary page action that should stay reachable while scrolling - Quick add."
  ],
  "whenNotToUse": [
    "Multiple competing floating actions on one screen - pick the single truly persistent action; route the rest through a menu or inline buttons.",
    "An action that already exists inline on the page - don't duplicate it as a float - that just adds visual noise.",
    "Complex, multi-step actions - a Float Button should trigger something simple or open another surface (Modal, Drawer) - it shouldn't carry the whole flow itself."
  ],
  "bestPractices": [
    "Use exactly one Float Button per screen so it stays meaningfully \"the\" persistent action.",
    "Choose an icon that is universally recognizable without a label (a plus, an upward arrow, a chat bubble).",
    "Reserve the badge dot for a real unread/pending count, not decoration.",
    "Always pair it with a tooltip, since the control itself carries no visible text."
  ],
  "doAndDont": {
    "do": "Exactly one floating action, so it reliably means \"the persistent thing you can always do here\".",
    "dont": "A stack of floating buttons covers the content it floats over and turns a clear affordance into a second navigation bar."
  },
  "accessibility": [
    "Icon-only, so it needs an explicit aria-label naming the action - there is no visible text to fall back on.",
    "The tooltip is a supplementary visual hint, not a substitute for the accessible name.",
    "Keeps a full-size touch target even though it's visually compact, meeting WCAG 2.2 target-size guidance."
  ],
  "relatedComponents": [
    "Primary Button",
    "Dropdown",
    "Tooltip",
    "Badge"
  ]
}

---

## Float Button

Source: float-button.html · Status: Available

Components · Actions

# Float Button
  
A circular button fixed to a screen corner for an always-accessible primary action, like "back to top" or "compose" - distinct from a normal inline Button, which sits within the page flow instead of hovering above it.

## Float Button type

Copy a ready-to-paste AI prompt or the working code - both use this system's own color tokens and Inter, never arbitrary values. Click the card to configure it in full.

System Control

          Copy prompt

---

## Colors

Source: foundations.html · Status: Available

Foundations · Colors

# Colors
  
Color carries meaning before anything else on the page loads. This system runs on one editable brand hue, a fixed set of semantic colors that never change meaning, and a neutral scale that flips between dark and light theme. Configure the two editable pieces below; everything else follows automatically.

## Brand color

        Human View
        Machine View

One primary hex drives the whole brand scale - hover/pressed (600), tint and glow are derived automatically. Light theme is set directly below; turn on dark theme to give it its own hue, generated from light as a starting point and fully refinable on its own.

      Also set a separate brand color for dark theme

Light theme

              Primary
              *

              #

rgb(255, 3, 26)

Derived scale

Dark theme

            Auto-generated
            Regenerate from Light

              Primary

              #

rgb(247, 72, 88)

Derived scale

      Save brand color
      Reset to default

{}

## Background & surface elevation

        Human View
        Machine View

Three stacked surfaces - page, panel and raised - separate content without relying on shadow. Light theme is set directly below; turn on dark theme to generate a matching set, refinable independently.

      Also set separate surface colors for dark theme

Light theme

Page (Primary)

              #

Panel (Secondary)

              #

Raised (Tertiary)

              #

Live preview

Page
            
Panel
              
Raised

Dark theme

            Auto-generated
            Regenerate from Light

Page (Primary)

              #

Panel (Secondary)

              #

Raised (Tertiary)

              #

Live preview

Page
            
Panel
              
Raised

      Save surface colors
      Reset to defaults

{}

## Semantic & status colors

        Human View
        Machine View

Success, warning, danger and info - independent of the brand hue, and by default identical in both themes so a red error stays recognizably the same red everywhere. Turn on dark theme only if a status color actually needs its own contrast against dark surfaces; each still defaults to the exact same hue as light until you change it.
    
Danger's default hex happens to match Brand's default hex (both start as the same red) - that's a coincidence of this system's brand color being red by default, not a link between the two. They're stored and edited completely separately (--danger-500 vs. --red-500): changing Brand's color above does not change Danger, and changing Danger here does not change Brand.
    
Status color anatomy - the actual recipe differs by component, by design, not one universal foreground/background/icon triplet: Alert uses a 3px status-colored left border plus a status-colored icon, with the banner's own neutral background and default body text untouched (a loud left edge, not a loud fill). Badge's status dot and Table's status cell use a plain solid status-colored dot next to default-colored text - no tint, no border. Tag's status variant is the one place that does tint the background (~12% opacity) with full-strength status-colored text, since a tag is meant to read as a small colored label on its own. Form validation text (Password, Upload, and every required-field error across Project setup/Foundations) uses plain danger-colored text with no icon or background - severity carried by color and the message itself, not by added chrome.
    
Status is not selection: a selected row/card/option uses Brand (the editable accent above), never a status color - a selected item isn't "successful" or "dangerous," so reusing Danger's red for "selected" would misread as an error state. This system has no chart or data-visualization component yet, so there is no separate data-series palette to keep distinct from status colors today - when one is added, it should use its own set of hues rather than reusing Success/Warning/Danger/Info, so an arbitrary data category never visually implies a severity judgment it doesn't have.

      Also set separate status colors for dark theme

Light theme

Success

              #

Confirmations, completed states, positive deltas.

Warning

              #

Needs attention but isn't blocking.

Danger

              #

Destructive actions, failed states, blocking errors.

Info

              #

Neutral, non-urgent context.

Dark theme

            Auto-generated
            Regenerate from Light

Success

              #

Warning

              #

Danger

              #

Info

              #

      Save status colors
      Reset to defaults

{}

## Neutral scale

        Human View
        Machine View

Seven steps of graphite plus one dedicated control border. 950 / 900 / 850 (page / panel / raised) are configured in Background & surface elevation above; the remaining four steps below cover hover fills, dividers, disabled content and control borders. Light is set directly; turn on dark to generate a matching set.

      Also set separate values for dark theme

Light theme

800 · Hover fill

              #

700 · Resting fill

              #

600 · Disabled / divider

              #

500 · Placeholder

              #

Control border

              #

Dark theme

            Auto-generated
            Regenerate from Light

800 · Hover fill

              #

700 · Resting fill

              #

600 · Disabled / divider

              #

500 · Placeholder

              #

Control border

              #

      Save neutral scale
      Reset to defaults

{}

## Light & dark theme behavior

        Human View
        Machine View

Light is the value you set directly, everywhere. Each section's own "customize dark separately" checkbox is genuinely its own - turning it on for Brand has no effect on Background, Status or Neutral (Foundation audit C02: an earlier shared-state mechanism forced all 4 checkboxes to match whichever one changed last, but only ever persisted the section you actually touched, so the other 3 looked reconfigured without their storage actually changing - a reload silently undid what the UI had just shown. Removed; each section always reads its own saved data on load, independent of the other 3).
    
What "off" actually falls back to is genuinely different for Brand than for the other three, and that's a deliberate distinction, not an inconsistency: Background/Status/Neutral's dark values are this system's own built-in per-theme defaults, designed to look right in dark theme on their own - leaving dark off for them means exactly that, this system's built-in dark default, nothing more. Brand has no equivalent "built-in default" to fall back to, because Brand is your chosen color, not this system's - so Brand always resolves a real dark value: auto-generated from your light color the moment dark is off, and fully independent the moment you edit it directly. Brand's dark value is saved and actively applied in dark theme either way; the checkbox only controls whether it's auto-generated or hand-picked.
    
The auto-generated starting point is a suggestion, not a guarantee - two different formulas, both reversible by editing the result directly. Brand's accent color desaturates by 8 (clamped to stay readable) and searches for the darkest lightness that still clears a 7:1 (AAA) contrast ratio against the active dark background, falling back to the best ratio found if 7:1 isn't reachable at that hue - so the auto-generated color is never just plausible, it's verified accessible against the surface it actually renders on. Background's three surfaces (Page/Panel/Raised) each carry your light color's own offset from its own light default onto the matching dark default, so an untouched field reproduces the tuned dark default exactly - Background additionally checks that the three stay at least 1.2 lightness points apart after any edit, live, and shows a warning if a custom choice collapses them too close to read as separate elevation steps.
    
Foundation audit C04 - what the AA/AAA badge under each hex field actually checks, stated plainly: the swatch's own hex, as an opaque color, against page background, primary text, or (Border) the adjacent surface, at fixed 4.5:1/7:1/3:1 thresholds. Brand's badge additionally checks its own hex as text on its own real, live 8% tint (--red-tint) - the one swatch with a real tint token to check against; Status/Neutral have none, so they don't get this second check. What it doesn't check: any specific real component's actual rendered pairing (a swatch may be used as fill, text, icon or border in different places, each with its own real contrast), text shown at a large/bold size (WCAG allows 3:1 there, not checked here), or any other opacity than Brand's own tint. A passing badge means this one color choice clears a fixed, context-free bar - not that every component using it conforms.
    
Primitive vs. semantic names: --red-500/-400/-600/-tint/-glow are this system's own current default - Brand is editable to any hue, so that name stops describing its actual color the moment someone picks a non-red brand. --brand-500/-400/-600/-tint/-glow are plain aliases that always equal the matching --red-* value, live, in either theme; reference the --brand-* name in anything new so the name stays true after a rebrand. Same reasoning for the 3 user-editable surface steps: --surface-page/-panel/-raised alias --graphite-950/-900/-850. Nothing existing was renamed - both names work, today and after this.
    
Foundation audit C02 - with each section's reset now correctly scoped to itself alone, a genuine all-at-once action replaces what the old cross-wiring bug used to look like by accident: this button actually resets all 4 sections' saved data, not just their dark checkboxes.

      Reset all colors to defaults

{
  "rule": "light-is-source-of-truth",
  "light": "set directly by the user, always the base value",
  "darkModeToggle": "4 genuinely independent checkboxes, one per family (brand/background-surface/semantic-status/neutral-scale) - enabling dark for one has no effect on the others (Foundation audit C02: an earlier shared-state mechanism visually forced all 4 together but only ever persisted the one actually touched; removed)",
  "dark": {
    "brand": "always resolved - auto-generated from light while the toggle is off, fully independent once edited directly; never falls back to a built-in default, because brand has no system-owned default to fall back to",
    "background-surface|semantic-status|neutral-scale": "optional - auto-generated from light the moment the toggle is on, fully independent once edited; while the toggle is off, these fall back to this system's own built-in per-theme default, not to light"
  },
  "appliesTo": ["brand", "background-surface", "semantic-status", "neutral-scale"],
  "formulaVersion": 2,
  "darkAccentFormula": { "appliesTo": "brand", "method": "HSL", "saturationDelta": -8, "saturationRange": [35, 100], "search": "darkest lightness (10-97) that still clears a 7:1 (AAA) contrast ratio against the active dark background; falls back to the best ratio found if 7:1 is unreachable at that hue" },
  "darkSurfaceFormula": { "appliesTo": "background-surface (page/panel/raised independently)", "method": "RGB offset from each role's own light/dark default, factor 0.4", "lightnessClamp": [2, 20] },
  "elevationHierarchyCheck": { "appliesTo": "background-surface", "minPairwiseLightnessGap": 1.2, "roles": ["page", "panel", "raised"], "note": "order is not required to be monotonic - this system's own light-theme defaults aren't (Panel is lightest) - only mutual distinguishability is checked" },
  "contrastBadgeScope": {
    "checks": "the swatch's own hex, as an opaque color, against page background / primary text / (border) adjacent surface at fixed 4.5:1 (AA) / 7:1 (AAA) / 3:1 (non-text) thresholds",
    "brandTintCheck": "additionally checks brand's hex as text on its own real, live 8% tint (--red-tint) - the one swatch with a real tint token; status/neutral have none",
    "doesNotCheck": ["any specific real component's actual rendered pairing", "large/bold text's lower 3:1 WCAG threshold", "opacity other than brand's own tint"],
    "note": "Foundation audit C04 - a passing badge means this one color choice clears a fixed, context-free bar, not that every component using it conforms"
  },
  "semanticAliases": {
    "note": "additive only - every primitive name below still works unchanged; prefer the semantic name in anything new",
    "brand-500": "red-500", "brand-400": "red-400", "brand-600": "red-600", "brand-tint": "red-tint", "brand-glow": "red-glow",
    "surface-page": "graphite-950", "surface-panel": "graphite-900", "surface-raised": "graphite-850"
  }
}

## Color tokens - Markdown export
    
A single Markdown snapshot of every section above - regenerates live the moment you change or save any color, so it's always in sync. Copy it straight into your design system docs or hand it to an AI/agent workflow.

      Copy Markdown

## Implementation contract

Saved validated choices override project recommendations, which override system defaults. This implementation contract governs static specimens. Resolved tokens in the current export are authoritative values. Component exceptions must name the affected role and reason.

### User and task flow
Set brand, surfaces, statuses and neutrals independently. Inspect light/dark applied pairs, save valid choices, then copy the current configuration. Enabling dark editing is durable and does not couple Danger to Brand.

### Roles and states
Brand communicates selection/actions; Success, Warning, Danger and Info communicate severity. Charts use a separate series palette. Foreground is selected per actual primary-button state. Status text uses an accessible semantic foreground against its real surface, not an untested raw hue.

### Accessible pairs
Normal text requires 4.5:1 and large text 3:1; essential non-text boundaries require 3:1. Decorative lines and disabled controls have different scope. Calculate alpha-composited backgrounds first. Recheck current Typography colors after surface edits. A passing swatch is not certification of every component.

### Derivation and hierarchy
Resolver version 1 derives hover by mixing brand with 25% white and pressed by mixing with 18% black; tint is 8% brand and glow 35%. Semantic readable foregrounds move toward black or white until the actual surface pair passes 4.5:1. Highly customized surfaces can collapse the page/panel/raised hierarchy: use a neutral border or restore separation deliberately; luminance order alone is not a universal hierarchy guarantee.

### Compatibility mapping
Existing red-* tokens represent brand/action; danger-* represent severity. type-*-color represents text by role; graphite-950/900/850 represents page/panel/raised surfaces. Prefer the exported color-brand, color-action, color-text and color-surface aliases for new consumers. Compatibility names retain their existing meaning and are not a license to use a brand hue for error feedback.

### Examples and recovery
A red brand with a red Danger is two independent choices. White text on default red can fail; use the resolved on-brand foreground. For a tinted Tag calculate status text versus its tinted surface. Use label/icon/message in addition to hue. Keep full hex validation and the last valid value while typing.

### Responsive and interaction
Picker numeric controls remain keyboard accessible. Escape returns focus to the trigger; outside dismissal does not trap focus. At narrow/zoomed widths keep fields and popup inside the content viewport. Use forced-color system colors rather than relying on tinted fills.

### Agent and export
Use semantic aliases and resolved light/dark values. Never infer status from brand hue or declare AA from a color alone. Export the pair, opacity, state, surface and verification result.

### Save and edit
Selections preview immediately. Save foundation commits valid settings in this browser and locks the editor. Select Edit foundation to revise saved settings; Cancel retains the saved settings. Storage failure keeps the draft editable.
Machine contract: section rules, storage, units and acceptance
{
  "schemaVersion": 1,
  "authority": "Saved validated choices override project recommendations, which override system defaults. This implementation contract governs static specimens. Resolved tokens in the current export are authoritative values. Component exceptions must name the affected role and reason.",
  "governance": {
    "owners": "Design System Lead owns token and compatibility policy. Designers own specimens and interaction contracts. Developers own resolver/export/import parity. QA and Accessibility own release evidence. Product teams own domain-specific confidence, privacy and retention policies.",
    "changes": "Change the JSON contract first, regenerate documentation/defaults/catalog/tokens, then run model, DOM and recipient checks. Link the changed finding IDs and evidence in the release review.",
    "compatibility": "Keep hue-named CSS tokens as compatibility aliases while semantic consumers migrate. Additive tokens retain schemaVersion 1. A removed/renamed key or changed stored meaning requires a schema migration, a version bump and a documented replacement before release. Keep the prior reader fixture until the migration is verified.",
    "deprecation": "Record old key, replacement, reason, introduced version, planned removal version and affected consumers. Do not remove a token while an active consumer still uses it. Future records are preserved rather than coerced.",
    "scope": "This is a web design system with one shared workspace profile. Native dp/sp adaptation and real agent execution require separate adapters and acceptance. User-defined colors and responsive exceptions require product-specific rendered verification."
  },
  "storage": {
    "version": 1,
    "legacy": "Unversioned valid records migrate in memory. Typography headingScaleVersion 2 applies the smaller six-heading scale once to older records, retaining other roles and existing font/color/style metrics. Later custom size edits are retained. Unsupported future records are preserved. The next successful write stamps the migrated version.",
    "future": "Reject unsupported future versions. Preserve raw data. Offer backup and explicit reset.",
    "invalid": "Foundation selections preview locally until Save foundation succeeds. Saved Foundation editors require Edit foundation before changes. Cancel discards the preview. Invalid drafts never replace saved records; storage failures retain the editable preview and the last durable record.",
    "concurrency": "A storage event refreshes applied tokens and disables stale editor controls until reload. Never merge simultaneous edits silently."
  },
  "units": {
    "base": "1rem = 16px at default browser settings. Do not fix the root font size.",
    "use": "Prefer rem for typography, spacing and control dimensions. Hairline borders and viewport thresholds may use px. Both equivalents appear in Markdown. SVG strokes use viewBox units. Ratios, percentages, columns, timing and weights are unitless or retain their own units.",
    "native": "Web CSS px/rem are not native dp/sp. A native adapter must map semantic roles, support text scaling and test device density. Native rendering is not shipped by this web library."
  },
  "acceptance": [
    "Compare page, applied tokens, durable record, Machine View and exported instructions.",
    "Test valid, unfinished, invalid, missing, malformed, legacy and future records. Exercise storage failure, reset, reload and another tab.",
    "Test 320, 375, 768, 1024 and 1440px widths, 200% zoom, text-spacing overrides, RTL and long/localized labels.",
    "Use keyboard and screen reader. Confirm focus return, names, values, error associations and status announcements.",
    "Verify actual rendered text/surface pairs, forced colors, reduced motion, print and exported recipes in a recipient fixture. Source or DOM checks alone are not rendered acceptance."
  ],
  "layers": {
    "content": 0,
    "sticky": 20,
    "popover": 40,
    "scrim": 60,
    "dialog": 70,
    "toast": 80,
    "tooltip": 90,
    "rules": "Each overlay gets an explicit owner and close/focus-return path. Portal menus out of clipped scroll containers. Nested dialogs stack one scrim per modal owner. Escape closes the top dismissible layer. Tooltips never block actions. Test collision and zoom; do not infer stacking order from shadow size."
  },
  "section": {
    "title": "Colors",
    "rules": {
      "User and task flow": "Set brand, surfaces, statuses and neutrals independently. Inspect light/dark applied pairs, save valid choices, then copy the current configuration. Enabling dark editing is durable and does not couple Danger to Brand.",
      "Roles and states": "Brand communicates selection/actions; Success, Warning, Danger and Info communicate severity. Charts use a separate series palette. Foreground is selected per actual primary-button state. Status text uses an accessible semantic foreground against its real surface, not an untested raw hue.",
      "Accessible pairs": "Normal text requires 4.5:1 and large text 3:1; essential non-text boundaries require 3:1. Decorative lines and disabled controls have different scope. Calculate alpha-composited backgrounds first. Recheck current Typography colors after surface edits. A passing swatch is not certification of every component.",
      "Derivation and hierarchy": "Resolver version 1 derives hover by mixing brand with 25% white and pressed by mixing with 18% black; tint is 8% brand and glow 35%. Semantic readable foregrounds move toward black or white until the actual surface pair passes 4.5:1. Highly customized surfaces can collapse the page/panel/raised hierarchy: use a neutral border or restore separation deliberately; luminance order alone is not a universal hierarchy guarantee.",
      "Compatibility mapping": "Existing red-* tokens represent brand/action; danger-* represent severity. type-*-color represents text by role; graphite-950/900/850 represents page/panel/raised surfaces. Prefer the exported color-brand, color-action, color-text and color-surface aliases for new consumers. Compatibility names retain their existing meaning and are not a license to use a brand hue for error feedback.",
      "Examples and recovery": "A red brand with a red Danger is two independent choices. White text on default red can fail; use the resolved on-brand foreground. For a tinted Tag calculate status text versus its tinted surface. Use label/icon/message in addition to hue. Keep full hex validation and the last valid value while typing.",
      "Responsive and interaction": "Picker numeric controls remain keyboard accessible. Escape returns focus to the trigger; outside dismissal does not trap focus. At narrow/zoomed widths keep fields and popup inside the content viewport. Use forced-color system colors rather than relying on tinted fills.",
      "Agent and export": "Use semantic aliases and resolved light/dark values. Never infer status from brand hue or declare AA from a color alone. Export the pair, opacity, state, surface and verification result.",
      "Save and edit": "Selections preview immediately. Save foundation commits valid settings in this browser and locks the editor. Select Edit foundation to revise saved settings; Cancel retains the saved settings. Storage failure keeps the draft editable."
    }
  }
}

---

## Grid & Layout

Source: grid-layout.html · Status: Available

Foundations · Grid & Layout

# Grid & Layout
  
Spacing defines relationships, radius defines shape - grid defines structure. This is the invisible system that keeps every column, container and breakpoint coherent across the product.

## Breakpoints

        Human View
        Machine View

The actual thresholds this system's own CSS switches on today, not an idealized scale - documented here so a new rule reuses one of these instead of quietly adding a twelfth. A plain CSS custom property can't drive a media-query condition (screen width is evaluated before any variable resolves), so these are reference values to copy literally rather than a token you can point to.

        900px
        The one real structural collapse: sidebar leaves the grid and becomes a slide-in drawer; Project setup's layout stacks to one column
        max-width

        1440 / 1100 / 700px
        Component-listing grids step down one column at each (4 → 3 → 2 → 1)
        max-width

        640px
        Topbar padding tightens; version badge and keyboard-shortcut hint hide; Project setup's fields collapse to one column; its action buttons grow to a 44px touch target; Borders/Colors config grids collapse to one column (consolidated here from a separate 600px - Foundation audit G02)
        max-width

        641-1000px
        Borders page's configuration grid shows 2 columns (the range immediately above the 640px single-column threshold)
        range

        pointer: coarse
        Icon buttons and nav links grow to a 44px touch target on touch/coarse-pointer devices, regardless of viewport width
        capability

Foundation audit G02 - the "Overview collapses at 800px, the shared shell at 900px" gap previously documented here was itself stale: `overview.css` (where that 800px, plus 1600/1150/500px, lived) is never linked from any HTML page and has zero effect on the live site - confirmed by checking the actually-loaded stylesheet list and finding its target classes (`.resource-card`, `.workspace-panel`, etc.) nowhere in `overview.html`'s real markup. The live Overview page already uses the exact same shared-shell 900px threshold as every other page; there was no real drift to fix, only a stale claim to correct. overview.css, overview.js and overview-model.js are a separately pre-existing, already-documented gap (an earlier 1 October 2026 QA audit flagged all three as unreachable, recommending a product decision - fold Overview into this orphaned implementation, or remove it - that's out of scope for a breakpoints fix and isn't decided here).
    
What this finding did consolidate: 600px (Project setup's field collapse, several Config-grid collapses) onto the already-common 640px, eliminating one of the real, live stray values. What's left open, disclosed rather than silently dropped: 700px (the component-listing grid's third step) isn't yet folded into the 4-value canonical scale - it's structurally tied to that grid's own 4→3→2→1 step sequence, and collapsing it would change how many columns real component-listing pages show at that width, a visible layout change warranting its own dedicated pass rather than a drive-by rename.

{
  "breakpoints": [
    { "value": "900px", "type": "max-width", "effect": "sidebar becomes a slide-in drawer; Project setup's layout stacks to one column" },
    { "value": "1440 / 1100 / 700px", "type": "max-width", "effect": "component-listing grids step down one column at each (4→3→2→1)" },
    { "value": "640px", "type": "max-width", "effect": "topbar padding tightens; version badge/shortcut hint hide; Project setup fields collapse; Borders/Colors config grids collapse to one column (consolidated from 600px - G02)" },
    { "value": "641-1000px", "type": "range", "effect": "Borders page's configuration grid shows 2 columns" },
    { "value": "pointer: coarse", "type": "capability", "effect": "icon buttons and nav links grow to a 44px touch target" }
  ],
  "correctedClaim": "Overview collapsing at 800px vs the shared shell's 900px was stale - overview.css is never loaded by any page (confirmed via the live stylesheet list), so its 800px rule has no real effect; the live Overview page already uses the shared shell's 900px",
  "preExistingGap": "overview.css/.js/overview-model.js are unreachable (flagged in an earlier 1 October 2026 QA audit, not newly found here) - a product decision (fold Overview into this implementation, or remove it) is out of scope for this breakpoints finding",
  "stillOpen": "700px (the component-listing grid's own third step) is not yet folded into the 4-value scale - tied to that grid's real 4-column-step sequence, left for a dedicated pass"
}

## What are you building?

        Human View
        Machine View

Pick the product type closest to yours and the recommended column count and gutter below update to match - every value stays fully editable afterward.

        SaaS
        12-col · 24px gutter

        Enterprise SaaS
        12-col · 20px gutter

        Web Application
        12-col · 24px gutter

        Desktop Web (D-Web)
        12-col · 24px gutter

        Mobile Web (M-Web)
        4-col · 16px gutter

        Mobile Application
        4-col · 16px gutter

        Dashboard
        12-col · 16px gutter

        Data-Heavy Application
        16-col · 12px gutter

        Marketing Website
        12-col · 32px gutter

        Consumer App
        4-col · 16px gutter

        AI Product
        12-col · 24px gutter

        Cross-Platform
        8-col · 20px gutter

Recommended

{}

## Grid type

        Human View
        Machine View

Structure defines composition; this decides how content is placed before any spacing or component rules apply.

          Custom

Define your own grid behavior from scratch.
        
Custom

          Columns
          Recommended

Page structure, cards, forms, navigation - the default for most products.

          Rows

Vertical rhythm for editorial layouts, dashboard shells and data-heavy screens.

          Columns + Rows

A full grid for advanced desktop layouts, design tools and data visualization.

        Baseline Grid

An optional 4/8px vertical rhythm layered under the layout - never forced. Independent of Columns/Rows/Columns+Rows/Custom above; toggle it on with any of them.

      Columns
      Gutter

Custom grids need their own columns and gutter defined - pick values above before saving.

      Save grid system
      Reset to defaults

{}

## Layout patterns

        Human View
        Machine View

Reusable compositions that consume the grid above instead of inventing new structure per screen.

        Single Column
        
Centered content, no structural sidebar - docs, articles, forms.
        
Content

        Two Column
        
Two balanced content areas side by side.
        
AB

        Sidebar + Content
        
Persistent navigation alongside the primary content area.
        
SidebarMain

        Dashboard
        
Header, KPI row and a large chart or table beneath.
        
HeaderKPIKPIKPIChart

        Split View
        
Two equally-weighted panes, e.g. a live preview beside an editor - a static starting ratio, not a resizable one. The moment a user should be able to drag the divider, this is Splitter's layout, not a plain CSS split: Splitter already enforces sensible minimum sizes on both panes and makes the divider keyboard-operable (arrow keys), so don't reimplement either rule here. Equal weighting is a default, not a rule - when one side's content is reliably more important (e.g. the editor over its own live preview), give it the larger share instead of forcing 50/50. If either pane needs something pinned while its own content scrolls (a toolbar, a header), see Affix's own guidance on accounting for overlap so the pinned element never permanently covers content beneath it.
        
PreviewEditor

        Card Grid
        
A responsive grid of equal-weight cards.

        Hero + Content
        
A full-bleed hero above a contained content area.
        
HeroContent

        Master-Detail
        
A scannable list drives which record's full detail shows beside it - email, settings, a record browser. Looks like Sidebar + Content, but the narrow pane is selectable content, not persistent app navigation. If the list pane should be resizable rather than a fixed width, that's Splitter's layout underneath this pattern, with the same minimum-size and keyboard-resize rules as Split View above - not a separate set of rules to invent here.
        
Foundation audit G06 - the diagram alone doesn't define the responsive journey, so stating it here: narrow transform - List and Detail never show side-by-side below the 900px structural breakpoint; narrow shows exactly one pane at a time, List by default. Selecting a record replaces the List view with Detail (a drill-down, not both panes stacked - stacking an unbounded list above its own detail doesn't work at phone width). Back is an explicit, visible control in Detail at narrow width (not reliance on the browser's own back button alone, which may not even apply if selection didn't push a history entry) that returns to List with its scroll position and the previously-selected row's highlight both preserved, not a reset to the top. Focus order: selecting a record moves focus to Detail's own heading, not left behind in the list; pressing Back returns focus to that same previously-selected row, not the top of the page - the same restore-to-origin rule, run in both directions. Pane states: Detail before any selection (wide width only, since narrow never shows an empty Detail - there's nothing to select into yet) reads as a real empty state ("Select a record to see its details"), not a blank box; loading state while a selected record's detail is fetched is a skeleton or spinner, not a flash of empty state; an error state offers retry, not a silent blank.
        
ListDetail

Overflow (Foundation audit G05 - this used to say "scroll that one region" as the across-the-board default, too broad for forms, reflow or nested regions): reflow first - let the whole page scroll, the normal web default, for anything without a structural reason to be fixed-height: a long form, a settings page, any section that's just "more content than fits." A region only gets its own independent scroll when it has a genuine structural reason to stay a fixed size while its content varies - this shell's own sidebar+main split (both fixed-height, both scroll independently of each other, by design) and bounded data regions like a dashboard KPI row or List's items in Master-Detail (once virtualization is warranted per Table's own paginationAndVirtualization guidance) are the real, named cases, not a blanket rule for every overflow.
    
A region that does get its own scroll needs: a name (an accessible label identifying what it is, e.g. aria-label="Resource list", not just an anonymous scrollable div), keyboard operability (focusable and Page-Up/Down/arrow-operable - native for a plain overflow region, but verify it if the region also contains its own focusable children), a visible affordance (a real scrollbar or fade/shadow edge - never overflow:auto with nothing hinting there's more), and any fixed action inside it (a toolbar, a "Save" button) staying reachable without first scrolling past unrelated content to find it. Two of these nested inside each other (a scrollable region inside another scrollable region) is close to always wrong - it's the specific anti-pattern a blanket "just scroll it" rule tends to produce.
    
Two cases the old rule didn't address at all: a virtual keyboard opening on mobile shrinks the viewport - a nested scroll region sized against the viewport's original height can end up clipped behind the keyboard with no way to reach what's now off-screen; reflow (letting the real page scroll) sidesteps this automatically, which is one more reason to prefer it. And truncation (text-overflow ellipsis, a collapsed pane) is only a complete pattern paired with real recovery - an explicit, keyboard-reachable "Show more" control that reveals the rest, not silently-clipped text with no way back to it.

{
  "patterns": [
    "Single Column", "Two Column", "Sidebar + Content", "Dashboard",
    "Split View", "Card Grid", "Hero + Content", "Master-Detail"
  ],
  "overflowRule": {
    "default": "reflow - let the whole page scroll, for anything without a structural reason to be a fixed size",
    "independentScrollJustifiedFor": ["persistent structural chrome (sidebar+main, each fixed-height by design)", "bounded data regions (dashboard KPI row, Master-Detail's list pane once virtualized)"],
    "requirementsForAnyScrollRegion": ["accessible name/label", "keyboard operability (verify if it contains its own focusable children)", "visible scroll affordance, never silent overflow:auto", "fixed actions stay reachable without scrolling past unrelated content first"],
    "avoid": "nested scroll-in-scroll regions - close to always the wrong result of applying the old blanket rule",
    "virtualKeyboard": "a nested region sized against the original viewport height can end up clipped behind an opened mobile keyboard; reflow avoids this since the real page resizes naturally",
    "truncationRequiresRecovery": "an explicit, keyboard-reachable Show more control, not silently-clipped text with no way back to it"
  },
  "masterDetailResponsive": {
    "narrowBreakpoint": "900px (the same structural breakpoint as the shell's own sidebar collapse)",
    "narrowBehavior": "exactly one pane at a time - List by default; selecting a record replaces List with Detail (drill-down), panes are never stacked",
    "back": "an explicit, visible control in Detail at narrow width - not reliance on the browser's own back button alone; returns to List with scroll position and the selected row's highlight both preserved",
    "focusOrder": "selecting a record moves focus to Detail's own heading; Back returns focus to the same previously-selected row, not page top - restore-to-origin in both directions",
    "paneStates": { "emptyDetail": "wide width only, before any selection - a real empty state, not a blank box", "loading": "skeleton/spinner, not a flash of empty state", "error": "offers retry, not a silent blank" }
  }
}

## How this page fits together

        Human View
        Machine View

Breakpoints, grid and layout patterns are three layers of the same decision, not three unrelated choices: the Breakpoints above are where anything on this page actually changes; the product type and grid type set how content is divided into columns and rows at any given width; a Layout pattern is just a named, reusable way of filling that grid that this system already has a diagram for, so a new screen composes one of these instead of inventing structure from scratch.

{
  "layers": [
    { "layer": "breakpoints", "role": "where anything on this page actually changes" },
    { "layer": "product type + grid type", "role": "how content is divided into columns/rows at any given width" },
    { "layer": "layout pattern", "role": "a named, reusable way of filling that grid - compose one instead of inventing structure from scratch" }
  ]
}

## Grid & Layout tokens - Markdown export
    
A Markdown snapshot of your current product type and grid type choices above - regenerates live as you pick, so it's always in sync. Copy it straight into your design system docs or hand it to an AI/agent workflow.

      Copy Markdown

## Implementation contract

Saved validated choices override project recommendations, which override system defaults. This implementation contract governs static specimens. Resolved tokens in the current export are authoritative values. Component exceptions must name the affected role and reason.

### Geometry
Columns are integers 1–24; gutters are integers 0–64px. Rows, Columns+Rows and Custom obey the same validation. Baseline is independent. Custom requires explicit geometry; saved geometry is the buildable result, not a preset name.

### Platform profiles
The workspace applies one global profile. One selected platform supplies its recommendation; multiple platforms use the product recommendation. Exports also include a light/dark recommendation snapshot for each selected platform, with saved overrides retained. Consumers choose the matching platform profile explicitly; these exports do not automatically implement native layouts or viewport switching. Unsupported context falls back to system defaults and requires review.

### Container and spans
Use a centered container capped by --size-content (default 1200px), min-width:0, equal logical gutters and border-box sizing. Main gutters are 40px desktop, 24px compact and 16px below 640px. A span k in N columns is (available width minus (N-1) gutters)/N multiplied by k plus (k-1) gutters. Nested grids use their parent content box, never the full viewport.

### Breakpoints and density
640px governs compact reflow and 900px shell navigation. The default 1200px content cap is not a viewport breakpoint. Listing grids retain 1440/1100/700px for their 4→3→2→1 preview sequence; those compatibility thresholds preserve wider 180–220px specimens and their action rows. Container thresholds 560/800px govern reference rows; Typography uses 960/640/420px for 3/2/1 control columns. The Border editor's 1000px two-column exception accommodates its six property fields. These content exceptions require boundary/zoom evidence before changes. Density never reduces accessible targets.

### Pattern inventory
Single column stacks all content. Split view becomes a labelled drill-down with Back and focus return. Master-detail uses list then detail with loading/empty/error states. Dashboard preserves reading order while stacking cards. Sidebar moves to the navigation drawer. Three-column layouts collapse secondary then tertiary panes. Masonry preserves DOM reading order. Full-screen workspaces keep primary actions reachable and independently name justified scroll regions.

### Resize and panes
Splitter panes have explicit min/max bounds, keyboard resizing, Home/End, and persistent user preference scoped to the layout. Collapse never hides the focused action. On wide-to-narrow transitions preserve selection and return focus on Back. Affix content stays below the measured banner and yields when its height exceeds half the viewport.

### Overflow and handoff
Reflow first. Confine unavoidable tables/code to named keyboard-operable scroll regions. Avoid page-wide horizontal scroll. Show truncation recovery. Export container, columns, gutter, spans, baseline, thresholds, pattern states and resize/overflow rules.

### Pattern: Single Column
Use one readable content column within the shared maximum container. At narrow widths keep source order, equal gutters and reachable primary actions. Empty content states explain why and offer the next action; loading reserves the expected structure; error offers retry without losing entries.

### Pattern: Two Column
Use two related columns at wide widths. Below 900px stack in source order rather than CSS visual reordering. Each column may show its own named empty/loading/error state. Keep keyboard focus in the edited column across reflow; do not shrink form labels or fields to fit.

### Pattern: Sidebar + Content
Use persistent navigation beside the main pane above 900px. At 900px and below use a named navigation drawer with a trigger, Escape dismissal and focus restoration. Selection updates the active navigation item; loading/error belongs to main content, not the whole navigation tree.

### Pattern: Dashboard
Header precedes KPI cards and then charts/tables in source order. Cards wrap with minmax and a minimum readable width rather than a fixed card count. Preserve independent loading/error states per region and expose exact values for abbreviated metrics. Bounded wide tables scroll in a named keyboard-operable region.

### Pattern: Split View
Wide uses two panes with an explicit content-priority ratio. Narrow stacks editor then preview in source order; preserve entered data and the current focus. Resizing uses the shared Splitter controller with arrow keys, Shift/Home/End, collapse/restore, pointer cancellation and versioned ratios. A static split has no fake interactive handle.

### Pattern: Card Grid
Equal-weight cards use auto-fit with a documented minimum readable width. Narrow reflows to one column; keep DOM reading order. Clickable cards expose one named link or action. Static cards do not gain hover elevation. Empty/loading/error states occupy the collection region and retain filter values.

### Pattern: Hero + Content
A hero may span the container but its text and actions keep the same safe content gutters as the body. At narrow widths wrap text, contain imagery and keep primary actions visible. Do not use a fixed height that clips expansion, zoom or a long translated title. Decorative imagery has empty alternative text.

### Pattern: Master-Detail
Above 900px keep list and detail side by side; before selection show a real detail empty state. At 900px and below display only list or detail. Selecting moves focus to the detail heading; Back restores the selected row and list scroll. Loading retains selection and aria-busy; error offers Retry for the same record. Clear selection restores the originating list focus. The Try Master-Detail specimen exercises this local journey.

### Save and edit
Selections preview immediately. Save foundation commits valid settings in this browser and locks the editor. Select Edit foundation to revise saved settings; Cancel retains the saved settings. Storage failure keeps the draft editable.
Machine contract: section rules, storage, units and acceptance
{
  "schemaVersion": 1,
  "authority": "Saved validated choices override project recommendations, which override system defaults. This implementation contract governs static specimens. Resolved tokens in the current export are authoritative values. Component exceptions must name the affected role and reason.",
  "governance": {
    "owners": "Design System Lead owns token and compatibility policy. Designers own specimens and interaction contracts. Developers own resolver/export/import parity. QA and Accessibility own release evidence. Product teams own domain-specific confidence, privacy and retention policies.",
    "changes": "Change the JSON contract first, regenerate documentation/defaults/catalog/tokens, then run model, DOM and recipient checks. Link the changed finding IDs and evidence in the release review.",
    "compatibility": "Keep hue-named CSS tokens as compatibility aliases while semantic consumers migrate. Additive tokens retain schemaVersion 1. A removed/renamed key or changed stored meaning requires a schema migration, a version bump and a documented replacement before release. Keep the prior reader fixture until the migration is verified.",
    "deprecation": "Record old key, replacement, reason, introduced version, planned removal version and affected consumers. Do not remove a token while an active consumer still uses it. Future records are preserved rather than coerced.",
    "scope": "This is a web design system with one shared workspace profile. Native dp/sp adaptation and real agent execution require separate adapters and acceptance. User-defined colors and responsive exceptions require product-specific rendered verification."
  },
  "storage": {
    "version": 1,
    "legacy": "Unversioned valid records migrate in memory. Typography headingScaleVersion 2 applies the smaller six-heading scale once to older records, retaining other roles and existing font/color/style metrics. Later custom size edits are retained. Unsupported future records are preserved. The next successful write stamps the migrated version.",
    "future": "Reject unsupported future versions. Preserve raw data. Offer backup and explicit reset.",
    "invalid": "Foundation selections preview locally until Save foundation succeeds. Saved Foundation editors require Edit foundation before changes. Cancel discards the preview. Invalid drafts never replace saved records; storage failures retain the editable preview and the last durable record.",
    "concurrency": "A storage event refreshes applied tokens and disables stale editor controls until reload. Never merge simultaneous edits silently."
  },
  "units": {
    "base": "1rem = 16px at default browser settings. Do not fix the root font size.",
    "use": "Prefer rem for typography, spacing and control dimensions. Hairline borders and viewport thresholds may use px. Both equivalents appear in Markdown. SVG strokes use viewBox units. Ratios, percentages, columns, timing and weights are unitless or retain their own units.",
    "native": "Web CSS px/rem are not native dp/sp. A native adapter must map semantic roles, support text scaling and test device density. Native rendering is not shipped by this web library."
  },
  "acceptance": [
    "Compare page, applied tokens, durable record, Machine View and exported instructions.",
    "Test valid, unfinished, invalid, missing, malformed, legacy and future records. Exercise storage failure, reset, reload and another tab.",
    "Test 320, 375, 768, 1024 and 1440px widths, 200% zoom, text-spacing overrides, RTL and long/localized labels.",
    "Use keyboard and screen reader. Confirm focus return, names, values, error associations and status announcements.",
    "Verify actual rendered text/surface pairs, forced colors, reduced motion, print and exported recipes in a recipient fixture. Source or DOM checks alone are not rendered acceptance."
  ],
  "layers": {
    "content": 0,
    "sticky": 20,
    "popover": 40,
    "scrim": 60,
    "dialog": 70,
    "toast": 80,
    "tooltip": 90,
    "rules": "Each overlay gets an explicit owner and close/focus-return path. Portal menus out of clipped scroll containers. Nested dialogs stack one scrim per modal owner. Escape closes the top dismissible layer. Tooltips never block actions. Test collision and zoom; do not infer stacking order from shadow size."
  },
  "section": {
    "title": "Grid & Layout",
    "rules": {
      "Geometry": "Columns are integers 1\u201324; gutters are integers 0\u201364px. Rows, Columns+Rows and Custom obey the same validation. Baseline is independent. Custom requires explicit geometry; saved geometry is the buildable result, not a preset name.",
      "Platform profiles": "The workspace applies one global profile. One selected platform supplies its recommendation; multiple platforms use the product recommendation. Exports also include a light/dark recommendation snapshot for each selected platform, with saved overrides retained. Consumers choose the matching platform profile explicitly; these exports do not automatically implement native layouts or viewport switching. Unsupported context falls back to system defaults and requires review.",
      "Container and spans": "Use a centered container capped by --size-content (default 1200px), min-width:0, equal logical gutters and border-box sizing. Main gutters are 40px desktop, 24px compact and 16px below 640px. A span k in N columns is (available width minus (N-1) gutters)/N multiplied by k plus (k-1) gutters. Nested grids use their parent content box, never the full viewport.",
      "Breakpoints and density": "640px governs compact reflow and 900px shell navigation. The default 1200px content cap is not a viewport breakpoint. Listing grids retain 1440/1100/700px for their 4\u21923\u21922\u21921 preview sequence; those compatibility thresholds preserve wider 180\u2013220px specimens and their action rows. Container thresholds 560/800px govern reference rows; Typography uses 960/640/420px for 3/2/1 control columns. The Border editor's 1000px two-column exception accommodates its six property fields. These content exceptions require boundary/zoom evidence before changes. Density never reduces accessible targets.",
      "Pattern inventory": "Single column stacks all content. Split view becomes a labelled drill-down with Back and focus return. Master-detail uses list then detail with loading/empty/error states. Dashboard preserves reading order while stacking cards. Sidebar moves to the navigation drawer. Three-column layouts collapse secondary then tertiary panes. Masonry preserves DOM reading order. Full-screen workspaces keep primary actions reachable and independently name justified scroll regions.",
      "Resize and panes": "Splitter panes have explicit min/max bounds, keyboard resizing, Home/End, and persistent user preference scoped to the layout. Collapse never hides the focused action. On wide-to-narrow transitions preserve selection and return focus on Back. Affix content stays below the measured banner and yields when its height exceeds half the viewport.",
      "Overflow and handoff": "Reflow first. Confine unavoidable tables/code to named keyboard-operable scroll regions. Avoid page-wide horizontal scroll. Show truncation recovery. Export container, columns, gutter, spans, baseline, thresholds, pattern states and resize/overflow rules.",
      "Pattern: Single Column": "Use one readable content column within the shared maximum container. At narrow widths keep source order, equal gutters and reachable primary actions. Empty content states explain why and offer the next action; loading reserves the expected structure; error offers retry without losing entries.",
      "Pattern: Two Column": "Use two related columns at wide widths. Below 900px stack in source order rather than CSS visual reordering. Each column may show its own named empty/loading/error state. Keep keyboard focus in the edited column across reflow; do not shrink form labels or fields to fit.",
      "Pattern: Sidebar + Content": "Use persistent navigation beside the main pane above 900px. At 900px and below use a named navigation drawer with a trigger, Escape dismissal and focus restoration. Selection updates the active navigation item; loading/error belongs to main content, not the whole navigation tree.",
      "Pattern: Dashboard": "Header precedes KPI cards and then charts/tables in source order. Cards wrap with minmax and a minimum readable width rather than a fixed card count. Preserve independent loading/error states per region and expose exact values for abbreviated metrics. Bounded wide tables scroll in a named keyboard-operable region.",
      "Pattern: Split View": "Wide uses two panes with an explicit content-priority ratio. Narrow stacks editor then preview in source order; preserve entered data and the current focus. Resizing uses the shared Splitter controller with arrow keys, Shift/Home/End, collapse/restore, pointer cancellation and versioned ratios. A static split has no fake interactive handle.",
      "Pattern: Card Grid": "Equal-weight cards use auto-fit with a documented minimum readable width. Narrow reflows to one column; keep DOM reading order. Clickable cards expose one named link or action. Static cards do not gain hover elevation. Empty/loading/error states occupy the collection region and retain filter values.",
      "Pattern: Hero + Content": "A hero may span the container but its text and actions keep the same safe content gutters as the body. At narrow widths wrap text, contain imagery and keep primary actions visible. Do not use a fixed height that clips expansion, zoom or a long translated title. Decorative imagery has empty alternative text.",
      "Pattern: Master-Detail": "Above 900px keep list and detail side by side; before selection show a real detail empty state. At 900px and below display only list or detail. Selecting moves focus to the detail heading; Back restores the selected row and list scroll. Loading retains selection and aria-busy; error offers Retry for the same record. Clear selection restores the originating list focus. The Try Master-Detail specimen exercises this local journey.",
      "Save and edit": "Selections preview immediately. Save foundation commits valid settings in this browser and locks the editor. Select Edit foundation to revise saved settings; Cancel retains the saved settings. Storage failure keeps the draft editable."
    }
  }
}

---

## Group Button

Source: group-button-default.html · Status: Available

Components · Actions · Group Button
  Back to Group Button types

# Group Button
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
Use for switching between a small set of mutually exclusive options, like a view toggle or a time-range filter - one Group Button component, controlled by properties, not separate buttons glued together.

## Properties

Size, corner radius, button count, field label and supporting text are properties of the same component, not separate buttons - change them below to check this group's style and states in the Live Preview.

        Size

        Corner radius

        Number of buttons
        
          2
          3
          4
          5
          6
          7
          8
          9

        Content
        
          Text only
          Icon only
          Icon + Text

        Icon
        
          Plus
          Arrow
          Gear
          Star
          Check

        Icon position
        
          Before label
          After label

        Button labels

        Field label

          shown above the group

        Field label text

        Supporting text

          shown below the group

        Supporting text

## Live Preview
    
Both types compared side by side, each in all 6 states - the first segment demonstrates the row's state while the others stay at rest, except Disabled which applies to the whole group. One full matrix is rendered per selected combination of Size and Corner radius, at the chosen button count, with the optional field label and supporting text shown when enabled.

## Try it
    
The comparison matrix above freezes one segment per row to demonstrate each state side by side. This instance is real: click a segment to select it, exactly like a real segmented control.

        Default selected button

        Allow no selection

          click again to deselect

## When to use
    
Any small, fixed set of mutually exclusive options where only one can be active at a time.

      View toggle
      Time range
      Sort order
      Unit system
      Alignment

## Component Guide

        Human View
        Machine View

Overview
      
Group Button is a segmented control for switching between a small, fixed set of mutually exclusive options - one bordered strip of adjoining buttons where exactly one segment is active at a time, unlike Radio's separate circular inputs or Select's collapsed dropdown.

When to Use

- A view toggle - switching between List and Grid layouts.
        
- A time range or sort filter - Day/Week/Month, or a sort-order picker.
        
- A short, fixed set of exclusive settings - unit system (Metric/Imperial), text alignment.

When Not to Use

- More than five or six options - segments get cramped; use Select or Dropdown instead.
        
- Options that aren't mutually exclusive - use a Checkbox group so more than one can be active.
        
- A single on/off setting - use Switch - Group Button is for choosing among several options, not toggling one.

Best Practices

- Keep segment labels short (a word or an icon) so they never wrap or truncate.
        
- Use it for exactly one active option at a time - it is not a multi-select control.
        
- Keep the segment count small enough to fit without horizontal scrolling on narrow screens.

Do and Don't

Do
          
DayWeekMonth
          
A short, fixed set of mutually exclusive options, each label a single word, all visible at once.

Don't
          
Last 24 hoursPrevious calendar week
          
Sentence-length labels stretch the segments until the control no longer scans as a single row of choices. Use Select once labels get this long.

Accessibility

- Exposed as a group of real buttons with aria-pressed reflecting each segment's active state.
        
- Visible focus ring per segment, independent of the active-state background fill.
        
- The active segment is communicated by more than color alone (a filled background, not just a text-color change).

Related Components
      
Tabs (switches views rather than options), Radio (separate visible inputs), Select (a collapsed single choice), Switch (a single on/off setting), Button (all 8 Button types - see Components · Button - for the standalone action that sits next to a Group Button rather than inside it).

{
  "component": "Group Button",
  "category": "Actions",
  "summary": "Group Button is a segmented control for switching between a small, fixed set of mutually exclusive options - one bordered strip of adjoining buttons where exactly one segment is active at a time, unlike Radio's separate circular inputs or Select's collapsed dropdown.",
  "whenToUse": [
    "A view toggle - switching between List and Grid layouts.",
    "A time range or sort filter - Day/Week/Month, or a sort-order picker.",
    "A short, fixed set of exclusive settings - unit system (Metric/Imperial), text alignment."
  ],
  "whenNotToUse": [
    "More than five or six options - segments get cramped; use Select or Dropdown instead.",
    "Options that aren't mutually exclusive - use a Checkbox group so more than one can be active.",
    "A single on/off setting - use Switch - Group Button is for choosing among several options, not toggling one."
  ],
  "bestPractices": [
    "Keep segment labels short (a word or an icon) so they never wrap or truncate.",
    "Use it for exactly one active option at a time - it is not a multi-select control.",
    "Keep the segment count small enough to fit without horizontal scrolling on narrow screens."
  ],
  "doAndDont": {
    "do": "A short, fixed set of mutually exclusive options, each label a single word, all visible at once.",
    "dont": "Sentence-length labels stretch the segments until the control no longer scans as a single row of choices. Use Select once labels get this long."
  },
  "accessibility": [
    "Exposed as a group of real buttons with aria-pressed reflecting each segment's active state.",
    "Visible focus ring per segment, independent of the active-state background fill.",
    "The active segment is communicated by more than color alone (a filled background, not just a text-color change)."
  ],
  "relatedComponents": [
    "Tabs",
    "Radio",
    "Select",
    "Switch"
  ]
}

---

## Group Button

Source: group-button.html · Status: Available

Components · Actions

# Group Button
  
A row of joined segments where exactly one is selected at a time, like a view toggle or a time-range filter.

## Group Button type

Copy a ready-to-paste AI prompt or the working code - both use this system's own color tokens and Inter, never arbitrary values. Click the card to configure it in full.

            List
            Grid
            Map

System Control

          Copy prompt

---

## Component Guidelines

Source: guidelines.html · Status: Reference / planned

# Component Guidelines
  
Which component to reach for, by domain - the layer above an individual component's own page, for the moment before you've picked one yet.

## Component maturity
    
A component's own page title carries a badge only when it departs from the library's default expectation below. They describe what's actually been verified for that component, not a subjective quality rating - check a component's own page for its specific Accessibility notes and Component Guide to see that evidence directly.

        Default (unbadged)
        
Documented interaction behavior is implemented as written; has an accessible name, role and value for every control; is fully keyboard-operable with visible focus; renders correctly in both themes and at 320px; and has its own Component Guide page with Do/Don't guidance. This is the bar every component in this library is expected to meet unless flagged otherwise below.
        Guarantee

        Experimental
        
Usable today, but its interaction model, visual details or accessibility coverage are still being finalized and may change without the same stability guarantee an unbadged component carries. Review its own page's Accessibility notes before depending on specific behavior.
        Guarantee

        Mockup
        
Documentation or a visual reference only - not a working, implemented feature. Used for the handful of integration/reference pages that aren't components (NPM Package, History), not for components themselves.
        Guarantee

## Feedback - which one, when
    
Five components exist for reporting something to the user. Picking the wrong one either interrupts a task that didn't need interrupting, or lets something important scroll past unread.

        Toast
        
Confirms something the user just did, on their own timeline, gone in a few seconds
        toast.html

        Notification
        
Reports an event the user didn't initiate - a background job finishing, another user's action
        notification.html

        Alert
        
A persistent, page-level condition that stays until the situation changes or is dismissed
        alert.html

        Modal
        
A decision that must be made before the user can continue, with real consequences
        modal.html

        Pop Confirm
        
A single yes/no question anchored to the control that triggered it - lighter than a Modal
        pop-confirm.html

        Result
        
The end state of a completed flow - success, failure, or an outcome the user needs to act on next
        result.html

## Navigation - which one, when
    
Getting from one place to another, or showing where the user already is, without more machinery than the situation needs.

        Tabs
        
A handful of parallel views over the same object, switched without a page load
        tabs.html

        Breadcrumb
        
Where the current page sits inside a hierarchy the user can step back up through
        breadcrumb.html

        Anchor
        
Position within one long page - a reading-progress indicator, not a hierarchy
        anchor.html

        Steps
        
Position within a multi-step process the user is actively completing, in order
        steps.html

        Pagination
        
Position within a large result set split across pages
        pagination.html

        Menu / Dropdown
        
A list of actions or destinations chosen from, not a record of position
        menu.html

## Data Entry - which one, when
    
The input should match the shape of the answer the user already has - not the shape that's easiest to build.

        Select
        
One choice from a short, flat, known list, all visible at once when open
        select.html

        Autocomplete
        
Free text narrowed by real matches as the user types - for large or open-ended option sets
        autocomplete.html

        Cascader / Tree Select
        
A choice that genuinely nests two or more levels deep - not a flat list dressed up
        cascader.html

        Radio
        
2-5 mutually exclusive options, all visible, no need to open anything
        radio.html

        Checkbox
        
Independent yes/no choices, any number of which can be true at once
        checkbox.html

        Switch
        
A setting that takes effect immediately - never paired with a separate Save step
        switch.html

        Slider
        
An approximate, eyeballed value - pair with Number whenever the exact figure matters
        slider.html

        Date Range
        
Two dates that must stay logically ordered - one control, not two independent Date Pickers
        date-range.html

## Data Display - which one, when
    
Showing a set of records or values in the shape the reader actually needs to act on them.

        Table
        
Multiple comparable attributes per row - sortable, filterable, scannable by column
        table.html

        List
        
One event or record per row, each with an actor and a specific object - not comparable columns
        list.html

        Description
        
A record's fixed label/value pairs laid out for reading, not comparing across rows
        description.html

        Card
        
One self-contained subject, clickable as a single unit
        card.html

        Timeline
        
Events in chronological order where sequence and pacing both matter
        timeline.html

        Statistic
        
One headline number with the trend that gives it meaning
        statistic.html

        Empty
        
The deliberate zero-results state of any of the above - always says why, never just "No data"
        empty.html

## Button - hierarchy in one row
    
Every screen should have at most one Primary. Everything else is there to make the choice between actions legible, not to compete with it.

        Primary
        
The one action this screen exists to let the user complete - exactly one per view
        button-primary.html

        Secondary
        
A real alternative to Primary, never a destructive or high-stakes action undersold
        button-secondary.html

        Tertiary / Ghost / Link
        
Lowest-emphasis actions - view history, dismiss, inline text links
        button-tertiary.html

        Destructive
        
Reserved for actions that actually destroy something - paired with an easy way out
        button-destructive.html

        Neutral
        
Toolbar-weight actions (filter, sort) that shouldn't pull focus from the content
        button-neutral.html

## Data List - grouping and density
    
Long lists fail by hiding structure (everything looks the same) or by adding structure the data doesn't have (fake grouping, arbitrary dividers).

        Group only real boundaries
        
A Divider or section header marks an actual change in category - not every N items for rhythm
        divider.html

        Prefer built-in density over shrinking text
        
Compact mode reduces padding and row height, not font size - shrinking text just makes it harder to read
        guidelines.html

        Show total + position
        
Pagination states the result count; Table headers stay pinned on scroll so context never gets lost
        pagination.html

        One truncation rule per column
        
The same field is capped at the same width everywhere it's listed - not wider on this screen, narrower on that one
        table.html

## Component Guidelines - Markdown export
    
This page's own content, as Markdown - copy it straight into your design system docs or hand it to an AI/agent workflow.

      Copy Markdown

## Implementation contract

Saved validated choices override project recommendations, which override system defaults. This implementation contract governs static specimens. Resolved tokens in the current export are authoritative values. Component exceptions must name the affected role and reason.

### Structure
Use three columns for label, description and value. Descriptions contain their own Read More/Read Less control after four rendered lines. Stack values under descriptions at container 800px and stack all columns at 560px. Keep 16px gaps, 24px panel padding and 16px mobile padding.

### Interaction
Use labelled Group Buttons for section and Human/Machine choices with one selected state, roving arrow/Home/End navigation and visible keyboard focus. Keep copy, export and disclosure feedback accurate. Every component contract declares variant, state precedence, target, responsive behavior and exceptions.

### Copy outcomes
All component, pattern and template copy actions use the shared clipboard helper. Modern clipboard failure may fall back only when the legacy copy command succeeds. Otherwise show Copy failed and manual-copy guidance; preserve focus and original button contents. The displayed prompt/code remains available for selection.
Machine contract: section rules, storage, units and acceptance
{
  "schemaVersion": 1,
  "authority": "Saved validated choices override project recommendations, which override system defaults. This implementation contract governs static specimens. Resolved tokens in the current export are authoritative values. Component exceptions must name the affected role and reason.",
  "governance": {
    "owners": "Design System Lead owns token and compatibility policy. Designers own specimens and interaction contracts. Developers own resolver/export/import parity. QA and Accessibility own release evidence. Product teams own domain-specific confidence, privacy and retention policies.",
    "changes": "Change the JSON contract first, regenerate documentation/defaults/catalog/tokens, then run model, DOM and recipient checks. Link the changed finding IDs and evidence in the release review.",
    "compatibility": "Keep hue-named CSS tokens as compatibility aliases while semantic consumers migrate. Additive tokens retain schemaVersion 1. A removed/renamed key or changed stored meaning requires a schema migration, a version bump and a documented replacement before release. Keep the prior reader fixture until the migration is verified.",
    "deprecation": "Record old key, replacement, reason, introduced version, planned removal version and affected consumers. Do not remove a token while an active consumer still uses it. Future records are preserved rather than coerced.",
    "scope": "This is a web design system with one shared workspace profile. Native dp/sp adaptation and real agent execution require separate adapters and acceptance. User-defined colors and responsive exceptions require product-specific rendered verification."
  },
  "storage": {
    "version": 1,
    "legacy": "Unversioned valid records migrate in memory. Typography headingScaleVersion 2 applies the smaller six-heading scale once to older records, retaining other roles and existing font/color/style metrics. Later custom size edits are retained. Unsupported future records are preserved. The next successful write stamps the migrated version.",
    "future": "Reject unsupported future versions. Preserve raw data. Offer backup and explicit reset.",
    "invalid": "Foundation selections preview locally until Save foundation succeeds. Saved Foundation editors require Edit foundation before changes. Cancel discards the preview. Invalid drafts never replace saved records; storage failures retain the editable preview and the last durable record.",
    "concurrency": "A storage event refreshes applied tokens and disables stale editor controls until reload. Never merge simultaneous edits silently."
  },
  "units": {
    "base": "1rem = 16px at default browser settings. Do not fix the root font size.",
    "use": "Prefer rem for typography, spacing and control dimensions. Hairline borders and viewport thresholds may use px. Both equivalents appear in Markdown. SVG strokes use viewBox units. Ratios, percentages, columns, timing and weights are unitless or retain their own units.",
    "native": "Web CSS px/rem are not native dp/sp. A native adapter must map semantic roles, support text scaling and test device density. Native rendering is not shipped by this web library."
  },
  "acceptance": [
    "Compare page, applied tokens, durable record, Machine View and exported instructions.",
    "Test valid, unfinished, invalid, missing, malformed, legacy and future records. Exercise storage failure, reset, reload and another tab.",
    "Test 320, 375, 768, 1024 and 1440px widths, 200% zoom, text-spacing overrides, RTL and long/localized labels.",
    "Use keyboard and screen reader. Confirm focus return, names, values, error associations and status announcements.",
    "Verify actual rendered text/surface pairs, forced colors, reduced motion, print and exported recipes in a recipient fixture. Source or DOM checks alone are not rendered acceptance."
  ],
  "layers": {
    "content": 0,
    "sticky": 20,
    "popover": 40,
    "scrim": 60,
    "dialog": 70,
    "toast": 80,
    "tooltip": 90,
    "rules": "Each overlay gets an explicit owner and close/focus-return path. Portal menus out of clipped scroll containers. Nested dialogs stack one scrim per modal owner. Escape closes the top dismissible layer. Tooltips never block actions. Test collision and zoom; do not infer stacking order from shadow size."
  },
  "section": {
    "title": "Component Guidelines",
    "rules": {
      "Structure": "Use three columns for label, description and value. Descriptions contain their own Read More/Read Less control after four rendered lines. Stack values under descriptions at container 800px and stack all columns at 560px. Keep 16px gaps, 24px panel padding and 16px mobile padding.",
      "Interaction": "Use labelled Group Buttons for section and Human/Machine choices with one selected state, roving arrow/Home/End navigation and visible keyboard focus. Keep copy, export and disclosure feedback accurate. Every component contract declares variant, state precedence, target, responsive behavior and exceptions.",
      "Copy outcomes": "All component, pattern and template copy actions use the shared clipboard helper. Modern clipboard failure may fall back only when the legacy copy command succeeds. Otherwise show Copy failed and manual-copy guidance; preserve focus and original button contents. The displayed prompt/code remains available for selection."
    }
  }
}

---

## Projects have moved to Overview

Source: history.html · Status: Available

# Projects have moved to Overview
  
Find and reopen your saved projects in one place.
  Open Overview

---

## Icons

Source: icons.html · Status: Available

Foundations · Icons

# Icons
  
The visual language every icon in this system shares - pick a style, tune its weight and grid, then teach Claude or Gemini to keep generating more icons that match.

## Icon style

        Human View
        Machine View

How every icon is constructed - stroke, fill, or a layered combination of both. Duotone is the global default unless your product needs something bolder or more restrained.

          Line

Outlined strokes only, no fill - the clearest option at small sizes and in dense UI.

          Dashed

Line style with a broken stroke - for placeholders, drop zones and optional/inactive states.

          Flat

Solid single-color fill - bold and legible at a glance, best for large touch targets.

          Duotone
          Recommended

A muted base shape plus a solid accent layer - adds depth without adding extra color meaning.

          Two-tone

An outlined shape plus a solid accent layer - a stroke-first alternative to Duotone.

          Isometric

A 3D-angled block illustration - for empty states, onboarding and marketing moments, not dense UI.

          3D

A rendered, lit sphere - the most expressive option, reserved for hero moments.

{}

## Configure your icon system

        Human View
        Machine View

Grid size applies to every style; stroke width and corner treatment only apply to Line, Dashed and Two-tone - picking Flat, Duotone, Isometric or 3D above disables both controls rather than leaving them editable with no effect, since neither changes anything for a fill-based or illustrative style.
    
Icon-to-text gap: 8px (var(--space-8)) - the same gap every icon+label button already uses, not a separate icon-specific value.

        Grid size
        
          16px - dense UI, table rows
          20px - inline with text
          24px - standard default
          32px - touch targets, empty states

        Stroke width
        
          1.25 SVG units - light
          1.5 SVG units - regular
          1.8 SVG units - medium
          2.2 SVG units - bold

        Corner treatment
        
          Rounded joins & caps
          Sharp / miter joins

Live preview

AI Rule
      
A generated icon must use this page's own currently saved configuration, not its own judgment: the saved style (stroke vs. fill vs. illustrative), the saved size for its rendered width and height, with a consistent intrinsic viewBox (24x24 for geometric icons; 32x32 for the illustrative examples), and the saved stroke width in SVG units and corner treatment if the style is stroke-based - never a hardcoded color (currentColor only, confirmed: every icon on this page already follows this). Name it for the concept or action it represents ("delete," "notification"), use a semantic application alias even if the source library uses a shape-based name. A generated or AI-suggested icon needs human review before shipping, same as this system's AI & Agents foundation already requires for any AI-suggested content generally - this page doesn't get a silent exception. Only the libraries listed below (each with its own stated license) are approved reuse sources; an icon from anywhere else needs its own license checked before use, the same as any other third-party asset.

      Save icon system
      Reset to defaults

{}

## Icon states

        Human View
        Machine View

An icon rarely has its own dedicated state styling - it inherits whatever state its container (button, nav link, input) is already in, using the same tokens that container uses everywhere else.

        Rest
        Inherits currentColor from its container - never a hardcoded icon color
        currentColor

        Hover
        Follows the container's own hover color shift (e.g. text-mid to text-hi)
        currentColor

        Pressed / Active
        Follows the container's pressed-state color (e.g. a button's :active shade)
        currentColor

        Focus
        The icon itself is never separately outlined - its container's focus-visible ring is the only focus indicator
        --color-focus-ring

        Selected
        Follows the container's selected treatment (e.g. a nav link's active background/border)
        currentColor

        Disabled
        The icon dims with its container, not on its own - same opacity level, not a separate value
        --opacity-40 / --opacity-50

        Loading
        A loading icon (Spin, a button's own loading state) rotates via the shared motion tokens, never a bespoke animation
        --duration-slow, --ease-linear

{}

## Icon direction and motion
    
Not every directional icon means the same kind of "direction," so not every one mirrors in RTL - three real categories, not one blanket rule:

        Navigation (chevrons, carets, back/forward, pagination)
        Mirrors in RTL - "forward" is relative to reading direction, confirmed: this shell's own breadcrumb/cascader/tree/transfer/pagination/date-range/anchor icons already flip via [dir="rtl"] ... { transform: scaleX(-1); }
        Mirrors

        Trend / value (stock up/down, a progress arrow)
        Never mirrors - an upward trend means the same thing in every reading direction, since it encodes a value changing, not a reading-order position
        Invariant

        Physical / symbolic (search, trash, checkmark, a real-world object)
        Never mirrors - represents a fixed thing or action, not a position relative to reading direction, the same reason a photo of a physical object wouldn't flip either
        Invariant

Loading/motion: a looping icon (Spin, a button's own spinner) is slowed to a real 3-second rotation under prefers-reduced-motion: reduce, not frozen outright and not left at its normal speed - freezing it would read as a hung interface, since the rotation itself is the only signal that work is still happening. This is a deliberate per-component exception to the sitewide "near-zero duration" reduced-motion default (confirmed in shell.css), not an oversight that reduced motion forgot to cover.

## Bring your own icons

        Human View
        Machine View

Upload a handful of reference icons to establish your own visual style, or start from an existing open-source set instead of designing from scratch.
    
Uploaded files are style reference only, not verified for reuse - this page doesn't check or record where they came from or what license covers them. Verify you actually have the right to use each one (or trace it back to one of the approved libraries below) before it, or anything generated to match it, ships in a real product.

        Choose SVG, PNG, JPEG, WebP, GIF or AVIF references. Up to 2 MB per file; 10 files and 2.8 MB encoded in total.

Or start from an open-source library

        Lucide
        Line · ISC
        lucide.dev

        Feather Icons
        Line · MIT
        feathericons.com

        Heroicons
        Line / Flat · MIT
        heroicons.com

        Tabler Icons
        Line / Flat · MIT
        tabler.io/icons

        Phosphor Icons
        Line / Flat / Duotone · MIT
        phosphoricons.com

        Remix Icon
        Line / Flat · Apache 2.0
        remixicon.com

        Iconoir
        Line · MIT
        iconoir.com

        Material Symbols
        Line / Flat / Two-tone · Apache 2.0
        fonts.google.com/icons

        Font Awesome Free
        Line / Flat / Duotone · Free / CC BY 4.0
        fontawesome.com

        Bootstrap Icons
        Line / Flat · MIT
        icons.getbootstrap.com

{}

## Icon tokens - Markdown export
    
A Markdown snapshot of Icon style, Configure your icon system and Bring your own icons above - regenerates live as you edit, so it's always in sync. Copy it straight into your design system docs or hand it to an AI/agent workflow.

      Copy Markdown

## Implementation contract

Saved validated choices override project recommendations, which override system defaults. This implementation contract governs static specimens. Resolved tokens in the current export are authoritative values. Component exceptions must name the affected role and reason.

### Catalog and aliases
Use the bundled named catalog for edit, close, confirm, add, info and chevron-end. Resolve semantic action names through the catalog API. Existing library choices record source/style intent and do not download or replace the entire component glyph set. Other glyphs require a named source/version/license and optical review.

### Geometry and sources
UI glyphs use a 24x24 viewBox and currentColor. Illustrative isometric/3D examples use 32x32 and are not interchangeable with a 24px UI action icon. Rendered size uses --icon-size. Stroke is unitless SVG geometry. Optical centering/stroke normalization is reviewed independently of CSS width.

### Accessible examples
Decorative SVG: aria-hidden=true and focusable=false. Icon-only button: an explicit accessible name plus a 44px target; optional tooltip supplements the name. Status icon: visible message and semantic label. Loading icon: one coarse role=status announcement, reduced-motion fallback and no per-frame speech.

### Assets and recovery
Reference uploads are images up to 2MB each, at most 10 and 2.8MB encoded total. Keep choose/remove keyboard accessible; report read/decode errors. JSON packages references. Unreviewed SVG references render as images, never executable inline markup. Reference upload does not certify a reusable normalized glyph.

### RTL and motion
Mirror chevron-end and navigation arrows in RTL. Do not mirror physical objects, logos, text or mathematical/trend meaning without a semantic reason. Do not animate essential meaning. Prefer a static loading label with reduced motion.

### Agent and export
Include named action aliases, approved source/license, style, size, stroke, cap/join, currentColor, role, state and direction. AI-generated glyphs require source/geometry/accessibility review. Reject untrusted SVG scripts, event handlers, external references and foreignObject before any inline reuse.

### Save and edit
Selections preview immediately. Save foundation commits valid settings in this browser and locks the editor. Select Edit foundation to revise saved settings; Cancel retains the saved settings. Storage failure keeps the draft editable.
Machine contract: section rules, storage, units and acceptance
{
  "schemaVersion": 1,
  "authority": "Saved validated choices override project recommendations, which override system defaults. This implementation contract governs static specimens. Resolved tokens in the current export are authoritative values. Component exceptions must name the affected role and reason.",
  "governance": {
    "owners": "Design System Lead owns token and compatibility policy. Designers own specimens and interaction contracts. Developers own resolver/export/import parity. QA and Accessibility own release evidence. Product teams own domain-specific confidence, privacy and retention policies.",
    "changes": "Change the JSON contract first, regenerate documentation/defaults/catalog/tokens, then run model, DOM and recipient checks. Link the changed finding IDs and evidence in the release review.",
    "compatibility": "Keep hue-named CSS tokens as compatibility aliases while semantic consumers migrate. Additive tokens retain schemaVersion 1. A removed/renamed key or changed stored meaning requires a schema migration, a version bump and a documented replacement before release. Keep the prior reader fixture until the migration is verified.",
    "deprecation": "Record old key, replacement, reason, introduced version, planned removal version and affected consumers. Do not remove a token while an active consumer still uses it. Future records are preserved rather than coerced.",
    "scope": "This is a web design system with one shared workspace profile. Native dp/sp adaptation and real agent execution require separate adapters and acceptance. User-defined colors and responsive exceptions require product-specific rendered verification."
  },
  "storage": {
    "version": 1,
    "legacy": "Unversioned valid records migrate in memory. Typography headingScaleVersion 2 applies the smaller six-heading scale once to older records, retaining other roles and existing font/color/style metrics. Later custom size edits are retained. Unsupported future records are preserved. The next successful write stamps the migrated version.",
    "future": "Reject unsupported future versions. Preserve raw data. Offer backup and explicit reset.",
    "invalid": "Foundation selections preview locally until Save foundation succeeds. Saved Foundation editors require Edit foundation before changes. Cancel discards the preview. Invalid drafts never replace saved records; storage failures retain the editable preview and the last durable record.",
    "concurrency": "A storage event refreshes applied tokens and disables stale editor controls until reload. Never merge simultaneous edits silently."
  },
  "units": {
    "base": "1rem = 16px at default browser settings. Do not fix the root font size.",
    "use": "Prefer rem for typography, spacing and control dimensions. Hairline borders and viewport thresholds may use px. Both equivalents appear in Markdown. SVG strokes use viewBox units. Ratios, percentages, columns, timing and weights are unitless or retain their own units.",
    "native": "Web CSS px/rem are not native dp/sp. A native adapter must map semantic roles, support text scaling and test device density. Native rendering is not shipped by this web library."
  },
  "acceptance": [
    "Compare page, applied tokens, durable record, Machine View and exported instructions.",
    "Test valid, unfinished, invalid, missing, malformed, legacy and future records. Exercise storage failure, reset, reload and another tab.",
    "Test 320, 375, 768, 1024 and 1440px widths, 200% zoom, text-spacing overrides, RTL and long/localized labels.",
    "Use keyboard and screen reader. Confirm focus return, names, values, error associations and status announcements.",
    "Verify actual rendered text/surface pairs, forced colors, reduced motion, print and exported recipes in a recipient fixture. Source or DOM checks alone are not rendered acceptance."
  ],
  "layers": {
    "content": 0,
    "sticky": 20,
    "popover": 40,
    "scrim": 60,
    "dialog": 70,
    "toast": 80,
    "tooltip": 90,
    "rules": "Each overlay gets an explicit owner and close/focus-return path. Portal menus out of clipped scroll containers. Nested dialogs stack one scrim per modal owner. Escape closes the top dismissible layer. Tooltips never block actions. Test collision and zoom; do not infer stacking order from shadow size."
  },
  "section": {
    "title": "Icons",
    "rules": {
      "Catalog and aliases": "Use the bundled named catalog for edit, close, confirm, add, info and chevron-end. Resolve semantic action names through the catalog API. Existing library choices record source/style intent and do not download or replace the entire component glyph set. Other glyphs require a named source/version/license and optical review.",
      "Geometry and sources": "UI glyphs use a 24x24 viewBox and currentColor. Illustrative isometric/3D examples use 32x32 and are not interchangeable with a 24px UI action icon. Rendered size uses --icon-size. Stroke is unitless SVG geometry. Optical centering/stroke normalization is reviewed independently of CSS width.",
      "Accessible examples": "Decorative SVG: aria-hidden=true and focusable=false. Icon-only button: an explicit accessible name plus a 44px target; optional tooltip supplements the name. Status icon: visible message and semantic label. Loading icon: one coarse role=status announcement, reduced-motion fallback and no per-frame speech.",
      "Assets and recovery": "Reference uploads are images up to 2MB each, at most 10 and 2.8MB encoded total. Keep choose/remove keyboard accessible; report read/decode errors. JSON packages references. Unreviewed SVG references render as images, never executable inline markup. Reference upload does not certify a reusable normalized glyph.",
      "RTL and motion": "Mirror chevron-end and navigation arrows in RTL. Do not mirror physical objects, logos, text or mathematical/trend meaning without a semantic reason. Do not animate essential meaning. Prefer a static loading label with reduced motion.",
      "Agent and export": "Include named action aliases, approved source/license, style, size, stroke, cap/join, currentColor, role, state and direction. AI-generated glyphs require source/geometry/accessibility review. Reject untrusted SVG scripts, event handlers, external references and foreignObject before any inline reuse.",
      "Save and edit": "Selections preview immediately. Save foundation commits valid settings in this browser and locks the editor. Select Edit foundation to revise saved settings; Cancel retains the saved settings. Storage failure keeps the draft editable."
    }
  }
}

---

## Image

Source: image-default.html · Status: Available

Components · Data Display · Image
  Back to Image types

# Image
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
Use for displaying a photo or graphic that needs graceful loading, error and hover-preview states - one Image component, controlled by properties, not a bare unstyled <img> tag with no fallback handling.

## Properties

Corner radius, aspect ratio and caption are properties of the same component, not separate markup - change them below to check this frame's states in the Live Preview.

        Corner radius

        Aspect ratio
        
          Square
          Landscape
          Portrait

        Caption text

## Live Preview
    
Both types compared side by side, each in all 4 states - Loaded, Loading, Error and Hover. One full matrix is rendered per selected Corner radius, at the chosen aspect ratio, with the caption shown beneath the With caption type.

## When to use
    
Any place a photo or graphic needs to display with graceful loading, error and hover-preview behavior instead of a bare unstyled <img> tag.

      Product gallery
      Article cover photo
      User-generated content preview
      Document thumbnail
      Avatar upload preview

## Component Guide

        Human View
        Machine View

Overview
      
Image displays a photo or graphic with graceful loading, error, and hover-preview states built in - a styled wrapper around a real image with defined placeholder, broken-image, and zoom-preview behavior, instead of a bare, unstyled <img> tag with no fallback handling.

When to Use

- A product gallery or article cover photo - any primary visual content that benefits from a defined loading/error state.
        
- User-generated content previews - images uploaded by users, which may occasionally fail to load.
        
- Document thumbnails or an avatar upload preview - anywhere an image needs consistent framing and fallback handling.

When Not to Use

- A small identity graphic representing a person - use Avatar, which is purpose-built for that role, including initials fallback.
        
- A purely decorative background graphic with no meaningful content - a plain CSS background may be simpler than the full Image component's loading/error machinery.
        
- An icon - use the system's icon set rather than the Image component for small vector glyphs.

Best Practices

- Always define a visible loading placeholder that matches the image's eventual aspect ratio, so the layout doesn't jump once it loads.
        
- Show a clear, distinct broken-image state (not just a blank box) when a URL fails to resolve.
        
- Use the hover-zoom/preview behavior only where inspecting detail actually matters (a product photo), not on every image site-wide.

Do and Don't

Do

Warehouse floor plan, Level 2
          
A caption that says what the image actually is, useful the moment the picture itself fails to load.

Don't

Image
          
No caption and no alt text means a failed image leaves nothing behind but an empty box - the content is simply gone for that user.

Accessibility

- Every image carries meaningful alt text describing its content, or an empty alt when it's purely decorative.
        
- The broken-image fallback state is still announced meaningfully, not left as an unlabeled empty box.
        
- Zoom/preview interactions are reachable and dismissible by keyboard, not mouse-hover-only.

Related Components
      
Avatar, Empty, Skeleton.

{
  "component": "Image",
  "category": "Data Display",
  "summary": "Image displays a photo or graphic with graceful loading, error, and hover-preview states built in - a styled wrapper around a real image with defined placeholder, broken-image, and zoom-preview behavior, instead of a bare, unstyled <img> tag with no fallback handling.",
  "whenToUse": [
    "A product gallery or article cover photo - any primary visual content that benefits from a defined loading/error state.",
    "User-generated content previews - images uploaded by users, which may occasionally fail to load.",
    "Document thumbnails or an avatar upload preview - anywhere an image needs consistent framing and fallback handling."
  ],
  "whenNotToUse": [
    "A small identity graphic representing a person - use Avatar, which is purpose-built for that role, including initials fallback.",
    "A purely decorative background graphic with no meaningful content - a plain CSS background may be simpler than the full Image component's loading/error machinery.",
    "An icon - use the system's icon set rather than the Image component for small vector glyphs."
  ],
  "bestPractices": [
    "Always define a visible loading placeholder that matches the image's eventual aspect ratio, so the layout doesn't jump once it loads.",
    "Show a clear, distinct broken-image state (not just a blank box) when a URL fails to resolve.",
    "Use the hover-zoom/preview behavior only where inspecting detail actually matters (a product photo), not on every image site-wide."
  ],
  "doAndDont": {
    "do": "A caption that says what the image actually is, useful the moment the picture itself fails to load.",
    "dont": "No caption and no alt text means a failed image leaves nothing behind but an empty box - the content is simply gone for that user."
  },
  "accessibility": [
    "Every image carries meaningful alt text describing its content, or an empty alt when it's purely decorative.",
    "The broken-image fallback state is still announced meaningfully, not left as an unlabeled empty box.",
    "Zoom/preview interactions are reachable and dismissible by keyboard, not mouse-hover-only."
  ],
  "relatedComponents": [
    "Avatar",
    "Empty",
    "Skeleton"
  ]
}

---

## Image

Source: image.html · Status: Available

Components · Data Display

# Image
  
A container for displaying a photo or graphic, handling loading, error and hover-preview states consistently instead of a bare unstyled <img> tag.

## Image type

Copy a ready-to-paste AI prompt or the working code - both use this system's own color tokens and Inter, never arbitrary values. Click the card to configure it in full.

System Control

          Copy prompt

---

## Open your design system

Source: index.html · Status: Available

# Open your design system
Continue to project choices

---

## Input Text Field

Source: input-text-field.html · Status: Available

Components · Forms · Input
  Back to Input types

# Input Text Field
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
Use for collecting a single line of free-form text, like an email address, a name, or a search query.

## Properties

Size, corner radius, label, placeholder, leading icon and trailing icon are properties of the same component, not separate fields - change them below to check this field's style and states in the Live Preview.

        Size

        Corner radius

        Label

        Placeholder

        Icon placement

        Allow clear

          × button once filled

        Input type
        
          Text
          Email
          Password
          Search
          Telephone
          URL
          Number

        Maximum length

        Required

          shows a required indicator

        Supporting text

          shown below the field

        Supporting text

        Error message

## Live Preview
    
Exports include all 3 appearances, 8 states, 8 sizes and 6 corner radii, with editable text, visibility, icon swaps and a supporting-content slot. The selected configuration becomes the preview instance.

## When to use
    
Any form field that collects a single line of text - names, emails, search terms, or other short free-form values.

      Email
      Full name
      Search
      Phone number
      Company

## Component Guide

        Human View
        Machine View

Overview
      
Input (Text Field) is the base single-line text control for collecting free-form values - a label, a text box with a placeholder, and states for focus, filled, error and disabled - the foundation every more specialized text field (Password, Number, Search, and others) builds on.

When to Use

- Any short, free-form line of text - email address, full name, company name.
        
- A value with no fixed format the system can validate character-by-character - a search term typed into a form.
        
- A phone number or similar short structured value with no dedicated component - when no more specific field type exists.

When Not to Use

- A value from a fixed, known list - use Select so the user picks rather than types a value that must match exactly.
        
- Multiple lines of text - use Text Area.
        
- A secret value that should stay hidden while typing - use Password.
        
- A value with a live suggestion list - use Autocomplete or Mention.

Best Practices

- Always pair the field with a visible label, not placeholder-only text - placeholders disappear once typing starts and fail low-vision and memory-impaired users.
        
- Show validation errors inline, next to the field, with a specific message rather than a generic "Invalid input."
        
- Use placeholder text only for a format example (e.g. "name@company.com"), never as the only instruction for what to enter.

Do and Don't

Do

Email address

A visible label that stays put, with the placeholder showing the expected format rather than carrying the meaning.

Don't

A placeholder used as the label disappears the moment someone types, leaving the filled field unlabelled for anyone who looks away and back.

Accessibility

- The label is programmatically associated with the input (via for/id or by wrapping it), not just visually adjacent.
        
- The error state sets aria-invalid and links the error message with aria-describedby, so screen readers announce it.
        
- Focus state shows a visible outline distinct from the field's default border.

Related Components
      
Password, Number, Search, Autocomplete, Mention, Text Area.

{
  "component": "Input",
  "type": "Text Field",
  "category": "Forms",
  "summary": "Input (Text Field) is the base single-line text control for collecting free-form values - a label, a text box with a placeholder, and states for focus, filled, error and disabled - the foundation every more specialized text field (Password, Number, Search, and others) builds on.",
  "whenToUse": [
    "Any short, free-form line of text - email address, full name, company name.",
    "A value with no fixed format the system can validate character-by-character - a search term typed into a form.",
    "A phone number or similar short structured value with no dedicated component - when no more specific field type exists."
  ],
  "whenNotToUse": [
    "A value from a fixed, known list - use Select so the user picks rather than types a value that must match exactly.",
    "Multiple lines of text - use Text Area.",
    "A secret value that should stay hidden while typing - use Password.",
    "A value with a live suggestion list - use Autocomplete or Mention."
  ],
  "bestPractices": [
    "Always pair the field with a visible label, not placeholder-only text - placeholders disappear once typing starts and fail low-vision and memory-impaired users.",
    "Show validation errors inline, next to the field, with a specific message rather than a generic \"Invalid input.\"",
    "Use placeholder text only for a format example (e.g. \"name@company.com\"), never as the only instruction for what to enter."
  ],
  "doAndDont": {
    "do": "A visible label that stays put, with the placeholder showing the expected format rather than carrying the meaning.",
    "dont": "A placeholder used as the label disappears the moment someone types, leaving the filled field unlabelled for anyone who looks away and back."
  },
  "accessibility": [
    "The label is programmatically associated with the input (via for/id or by wrapping it), not just visually adjacent.",
    "The error state sets aria-invalid and links the error message with aria-describedby, so screen readers announce it.",
    "Focus state shows a visible outline distinct from the field's default border."
  ],
  "relatedComponents": [
    "Password",
    "Number",
    "Search",
    "Autocomplete",
    "Mention",
    "Text Area"
  ]
}

---

## Input

Source: input.html · Status: Available

Components · Forms

# Input
  
A single-line text field with three visual styles - Outlined, Filled and Underlined - each supporting the same six states.

## Input type

Copy a ready-to-paste AI prompt or the working code - both use this system's own color tokens and Inter, never arbitrary values. Click the card to configure it in full.

            Email address

Text Field

          Copy prompt

---

## List

Source: list-default.html · Status: Available

Components · Data Display · List
  Back to List types

# List
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
Use for displaying a collection of similar items as stacked rows, like a notification feed, a team member roster, or a file browser - one List component, controlled by properties, not a one-off stack of rows rebuilt per screen.

## Properties

Corner radius, size and row dividers are properties of the same component, not separate lists - change them below to check this list's types and states in the Live Preview.

        Corner radius

        Size

        Show dividers

          a thin line between each row

## Live Preview
    
Both types compared side by side, each in all 4 content states - plain rows, With avatars, With avatars and a trailing action link, and Loading. One full matrix is rendered per selected combination of Corner radius and Size, with the current Show dividers setting applied throughout.

## When to use
    
Any time a collection of similar items needs to be shown as a vertical stack of rows rather than a grid or table.

      Notification feed
      Team member roster
      File browser
      Search results list
      Activity log

## Component Guide

        Human View
        Machine View

Overview
      
List displays a collection of similar items as stacked rows, like a notification feed, a team member roster, or a file browser - a straightforward vertical arrangement, simpler than Table's fixed columns and lighter than wrapping every item in its own Card.

When to Use

- A notification feed or activity log - chronological or otherwise ordered similar entries.
        
- A team member roster or file browser - a stack of comparable items, each following the same row layout.
        
- A search results list - results that don't need Table's rigid column structure.

When Not to Use

- Data organized around several comparable columns per row - use Table, which is built for column-aligned structured data.
        
- A small number of visually distinct, self-contained content blocks - use Card, or a grid of Cards, when items need their own visual containment.
        
- A single set of label/value pairs describing one thing - use Description instead of a list of one.

Best Practices

- Keep row layout consistent across every item, even when some items have more content than others (use consistent placeholders/spacing).
        
- Show dividers or subtle spacing between rows so individual items stay scannable in a long list.
        
- Pair with Pagination or infinite scroll once the list grows beyond a comfortably scrollable length.

Do and Don't

Do

MK

Maya Khan
Commented on Invoice #4021
          
One event per row, each with an actor and a specific object, so scanning the list tells a clear story.

Don't

Update
Something changed in the system related to a record that was recently modified by a user in the workspace.
          
A vague title with a paragraph explaining nothing concrete forces the user to read every row in full to find out what actually happened.

Accessibility

- Implemented with real list semantics (ul/li or role="list"/"listitem"), so screen readers announce item count and position.
        
- Interactive rows (clickable to open a detail view) are real links or buttons, not divs with only a click handler.
        
- Any per-row action (like a remove or edit icon) has an accessible name identifying which item it applies to.

Related Components
      
Table, Card, Empty.

{
  "component": "List",
  "category": "Data Display",
  "summary": "List displays a collection of similar items as stacked rows, like a notification feed, a team member roster, or a file browser - a straightforward vertical arrangement, simpler than Table's fixed columns and lighter than wrapping every item in its own Card.",
  "whenToUse": [
    "A notification feed or activity log - chronological or otherwise ordered similar entries.",
    "A team member roster or file browser - a stack of comparable items, each following the same row layout.",
    "A search results list - results that don't need Table's rigid column structure."
  ],
  "whenNotToUse": [
    "Data organized around several comparable columns per row - use Table, which is built for column-aligned structured data.",
    "A small number of visually distinct, self-contained content blocks - use Card, or a grid of Cards, when items need their own visual containment.",
    "A single set of label/value pairs describing one thing - use Description instead of a list of one."
  ],
  "bestPractices": [
    "Keep row layout consistent across every item, even when some items have more content than others (use consistent placeholders/spacing).",
    "Show dividers or subtle spacing between rows so individual items stay scannable in a long list.",
    "Pair with Pagination or infinite scroll once the list grows beyond a comfortably scrollable length."
  ],
  "doAndDont": {
    "do": "One event per row, each with an actor and a specific object, so scanning the list tells a clear story.",
    "dont": "A vague title with a paragraph explaining nothing concrete forces the user to read every row in full to find out what actually happened."
  },
  "accessibility": [
    "Implemented with real list semantics (ul/li or role=\"list\"/\"listitem\"), so screen readers announce item count and position.",
    "Interactive rows (clickable to open a detail view) are real links or buttons, not divs with only a click handler.",
    "Any per-row action (like a remove or edit icon) has an accessible name identifying which item it applies to."
  ],
  "relatedComponents": [
    "Table",
    "Card",
    "Empty"
  ]
}

---

## List

Source: list.html · Status: Available

Components · Data Display

# List
  
A vertical list of rows for displaying a collection of similar items, each row with an optional leading avatar or icon, a title, a description, and trailing meta or actions.

## List type

Copy a ready-to-paste AI prompt or the working code - both use this system's own color tokens and Inter, never arbitrary values. Click the card to configure it in full.

JL

Jordan Lee
                
Product Designer

SO

Sam Ortiz
                
Engineer

PN

Priya Nair
                
PM

System Control

          Copy prompt

---

## Export & Handoff

Source: md-export.html · Status: Available

# Export & Handoff

Share your design system as Markdown or create editable components in Figma.

Markdown
Figma

## Choose what to include

Export scopeProject brief and foundationsBrief + selected component guidesBrief + documentation and selected components

Your product context, platform guidance and resolved foundation settings.
Foundation settings 
Include saved customizations

Select all foundationsClear foundations

Colors
Grid & Layout
Typography
Spacing
Radius
Borders
Shadows
Icons
Units (px/rem)
Shared sizing
Data Format

Unselected sections use library defaults in resolved dependencies. Their saved customizations are excluded; documentation may still describe them.

All saved foundation tokens are included automatically. Choose the components to build in Figma.
Components
Find a component

Select all componentsClear components

No matching components. Try another name.

Include my contact details
Name, email and designation are excluded by default.

Download .mdCopy Markdown

Figma export needs the local bridge. Markdown works directly from this file.Open Figma export through the bridge

Connection has not been checked.
Check connection

Export to Figma

## PreviewRefresh preview
Read-only Markdown

## Connect to Figma

- Start the local bridge from this project: node tools/component-bridge.cjs.
- Open this page through the bridge, then open Contract Bridge in your Figma document and connect.
- Choose your components and select Export to Figma. Keep the plugin open until the export finishes.

### What’s included
Saved foundation tokens and the selected editable components. Standard Button appearances are grouped into one family; the icon button is exported separately.

Large selections can take several minutes. Progress, warnings and any failed components appear here. Some browser layouts require approximation in Figma; review the result in your document.

## Use with your AI tool

- Review your project setup and customize the foundations you need.

- Review the component guidelines, choose components from the sidebar, and customize and copy their prompts from the detail pages.

- Select the relevant documentation here and download the Markdown file.

- Attach the file and component prompts to your AI tool. Ask it to use the saved tokens and verify the documented component behavior, responsiveness and accessibility.

The AI tool runs outside this workspace. Review and test its output before using it.

The export is a snapshot. Regenerate it after changing your setup or foundations.

HTML and CSS examples target the web. Native mobile and desktop products need platform-specific implementations.

Building an AI interface? See AI & Agents for its interaction patterns and foundations.

---

## Mention

Source: mention-default.html · Status: Available

Components · Forms · Mention
  Back to Mention types

# Mention
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
Use for a comment or message field where someone can tag another person inline, like "Hey @Jordan, can you review this?", without replacing the rest of the free-form text.

## Properties

Size, corner radius, label and placeholder are properties of the same component, not separate fields - change them below to check this field's style and states in the Live Preview.

        Size

        Corner radius

        Label

        Placeholder

        Allow clear

          × button once filled

        Required

          shows a required indicator

        Supporting text

          shown below the field

        Supporting text

        Error message

## Live Preview
    
Both types compared side by side, each in all 9 states. One full matrix is rendered per selected combination of Size and Corner radius - check more than one option in a dropdown to see every combination side by side.

## When to use
    
Any free-form text field where someone needs to tag or notify another person inline, mixed in with the rest of the message.

      Comments
      Team chat
      Task assignment
      Code review
      Support ticket

## Validation
    
Mention adds async suggestion states on top of whatever validation the underlying text field needs - what shows while matches are being fetched, what shows when there are none, and whether an unresolved "@" fragment is allowed to stand.

- Required marking - mark a required Mention field the same way as any other required field in this system (red asterisk after the label). When the form requires at least one valid mention specifically, say so in the field's helper text - "required" alone doesn't tell the user a mention is what's missing.
      
- Loading state - while the suggestion popover is fetching matches for whatever follows "@", show a lightweight loading indicator inside it rather than leaving it empty. An empty flash between keystroke and results reads as lag or a broken query, not as "still searching."
      
- No-results state - if nothing matches, show a specific, calm "No matches for '[query]'" message inside the popover instead of closing it silently. Closing without a message reads as a bug, not a deliberate empty state.
      
- Unresolved mentions - when the field requires every mention to resolve to a real, selected entity rather than arbitrary trailing text, validate that on blur or submit with a message like "Remove or fix the unresolved mention '@[text]'," naming the exact fragment that didn't resolve.

## Component Guide

        Human View
        Machine View

Overview
      
Mention is a free-form text field that lets someone tag another person inline by typing "@" followed by a name, inserting a distinct chip in the middle of otherwise normal text - used for comments, chat, and any message field where notifying a specific person matters.

When to Use

- Comments and team chat - tagging a teammate inline within a message.
        
- Task assignment through free text - "assign to @Jordan" inside a longer note.
        
- Code review and support ticket threads - notifying a specific reviewer or agent.

When Not to Use

- A field whose sole purpose is picking one person from a list - use Select or Autocomplete instead of a full free-text field with an embedded picker.
        
- Plain free-form text with no need to tag anyone - use Input or Text Area - the "@" trigger adds complexity that's wasted if never used.
        
- Tagging concepts, labels, or categories rather than people - use Tag or a multi-select Select instead of overloading the mention pattern.

Best Practices

- Trigger the suggestion panel immediately on "@" and filter it live as the user keeps typing a name.
        
- Render an inserted mention as a visually distinct chip, not plain text, so it's unambiguous who was tagged.
        
- Let the user keep typing free-form text before and after a mention - it should never take over the whole field.

Do and Don't

Do

Comment
Ping @ali

AKAli Khan
ARAlice Reed
          
Full name alongside the handle, so the right person is picked when two accounts start the same way.

Don't

Comment
Ping @ali

@ali
@ali2
          
Handles alone give the user no way to tell the two apart, so the notification goes to the wrong person.

Accessibility

- The suggestion panel is reachable by keyboard (arrow keys to move, Enter to insert, Escape to dismiss) without ever requiring a mouse.
        
- An inserted mention chip is announced as a distinct, named entity by screen readers, not read as raw "@username" text.
        
- The field's placeholder or label makes the "@" trigger discoverable for first-time users.

Related Components
      
Autocomplete, Text Area, Input, Tag.

{
  "component": "Mention",
  "category": "Forms",
  "summary": "Mention is a free-form text field that lets someone tag another person inline by typing \"@\" followed by a name, inserting a distinct chip in the middle of otherwise normal text - used for comments, chat, and any message field where notifying a specific person matters.",
  "whenToUse": [
    "Comments and team chat - tagging a teammate inline within a message.",
    "Task assignment through free text - \"assign to @Jordan\" inside a longer note.",
    "Code review and support ticket threads - notifying a specific reviewer or agent."
  ],
  "whenNotToUse": [
    "A field whose sole purpose is picking one person from a list - use Select or Autocomplete instead of a full free-text field with an embedded picker.",
    "Plain free-form text with no need to tag anyone - use Input or Text Area - the \"@\" trigger adds complexity that's wasted if never used.",
    "Tagging concepts, labels, or categories rather than people - use Tag or a multi-select Select instead of overloading the mention pattern."
  ],
  "bestPractices": [
    "Trigger the suggestion panel immediately on \"@\" and filter it live as the user keeps typing a name.",
    "Render an inserted mention as a visually distinct chip, not plain text, so it's unambiguous who was tagged.",
    "Let the user keep typing free-form text before and after a mention - it should never take over the whole field."
  ],
  "doAndDont": {
    "do": "Full name alongside the handle, so the right person is picked when two accounts start the same way.",
    "dont": "Handles alone give the user no way to tell the two apart, so the notification goes to the wrong person."
  },
  "accessibility": [
    "The suggestion panel is reachable by keyboard (arrow keys to move, Enter to insert, Escape to dismiss) without ever requiring a mouse.",
    "An inserted mention chip is announced as a distinct, named entity by screen readers, not read as raw \"@username\" text.",
    "The field's placeholder or label makes the \"@\" trigger discoverable for first-time users."
  ],
  "relatedComponents": [
    "Autocomplete",
    "Text Area",
    "Input",
    "Tag"
  ]
}

---

## Mention

Source: mention.html · Status: Available

Components · Forms

# Mention
  
A multi-line text field that lets someone tag another person inline by typing "@", turning the typed name into a highlighted chip within the surrounding text.

## Mention type

Copy a ready-to-paste AI prompt or the working code - both use this system's own color tokens and Inter, never arbitrary values. Click the card to configure it in full.

            Comment

Hey @Jordan, can you review this?

Mention Field

          Copy prompt

---

## Menu

Source: menu-default.html · Status: Available

Components · Navigation · Menu
  Back to Menu types

# Menu
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
A floating panel of commands or actions - what appears when a dropdown trigger, a right-click, or a "..." button is activated. This is the panel/list itself, controlled by properties, not the trigger that opens it.

## Properties

Size, corner radius and labels are properties of the same component, not separate buttons - change them below to check this menu's style and states in the Live Preview. Item count follows the number of labels entered.

        Size

        Corner radius

        Labels

## Live Preview
    
Both types compared side by side, each in all 6 states - the first item demonstrates the row's state while the others stay at rest (Selected and Loading apply to the whole panel). If the last label is "Delete" or "Remove", that item is automatically styled destructive with a divider above it, in every row. One full matrix is rendered per selected combination of Size and Corner radius.

## When to use
    
Any floating list of clickable commands or actions triggered by a control elsewhere on the page.

      Row actions
      Right-click context menu
      User account menu
      Bulk actions

## Component Guide

        Human View
        Machine View

Overview
      
Menu is the floating panel of commands or actions itself - what appears when a Dropdown trigger, a right-click, or a "..." button is activated. This component is the panel/list content, not the trigger that opens it, which is a separate concern handled by Dropdown or a custom trigger.

When to Use

- The panel opened by a Dropdown trigger - the list of commands itself.
        
- A right-click context menu - actions relevant to whatever was right-clicked.
        
- A user account menu or bulk-actions panel - any floating list of clickable commands triggered from elsewhere.

When Not to Use

- The trigger button itself - that's Dropdown's responsibility - Menu is only the panel content.
        
- A form value picker - use Select - Menu items are commands to run, not values to store.
        
- Persistent, always-visible navigation - use a nav bar or sidebar rather than a menu that must be triggered open.

Best Practices

- Group related items with dividers, and visually separate destructive actions (e.g. "Delete") at the bottom.
        
- Keep item labels as short, specific verbs ("Duplicate", "Archive") so the whole menu scans quickly.
        
- Close on selection, outside click, and Escape, consistent with Dropdown's expected behavior.

Do and Don't

Do

RenameDuplicateDelete
          
A top border separates the destructive action from the routine ones, so it cannot be clicked by momentum.

Don't

DeleteRenameDuplicate
          
Placing Delete first, right where the pointer lands on open, makes the riskiest action the easiest one to trigger by accident.

Accessibility

- Implemented with menu/menuitem roles, so arrow keys move between items and Home/End jump to the first/last item.
        
- Disabled items are exposed as unavailable to assistive technology, not just visually dimmed.
        
- Opening the menu moves focus into it, and closing it returns focus to whatever triggered it.

Related Components
      
Dropdown (its trigger), Tag, Button.

{
  "component": "Menu",
  "category": "Navigation",
  "summary": "Menu is the floating panel of commands or actions itself - what appears when a Dropdown trigger, a right-click, or a \"...\" button is activated. This component is the panel/list content, not the trigger that opens it, which is a separate concern handled by Dropdown or a custom trigger.",
  "whenToUse": [
    "The panel opened by a Dropdown trigger - the list of commands itself.",
    "A right-click context menu - actions relevant to whatever was right-clicked.",
    "A user account menu or bulk-actions panel - any floating list of clickable commands triggered from elsewhere."
  ],
  "whenNotToUse": [
    "The trigger button itself - that's Dropdown's responsibility - Menu is only the panel content.",
    "A form value picker - use Select - Menu items are commands to run, not values to store.",
    "Persistent, always-visible navigation - use a nav bar or sidebar rather than a menu that must be triggered open."
  ],
  "bestPractices": [
    "Group related items with dividers, and visually separate destructive actions (e.g. \"Delete\") at the bottom.",
    "Keep item labels as short, specific verbs (\"Duplicate\", \"Archive\") so the whole menu scans quickly.",
    "Close on selection, outside click, and Escape, consistent with Dropdown's expected behavior."
  ],
  "doAndDont": {
    "do": "A divider separates the destructive action from the routine ones, so it cannot be clicked by momentum.",
    "dont": "Placing Delete first, right where the pointer lands on open, makes the riskiest action the easiest one to trigger by accident."
  },
  "accessibility": [
    "Implemented with menu/menuitem roles, so arrow keys move between items and Home/End jump to the first/last item.",
    "Disabled items are exposed as unavailable to assistive technology, not just visually dimmed.",
    "Opening the menu moves focus into it, and closing it returns focus to whatever triggered it."
  ],
  "relatedComponents": [
    "Dropdown",
    "Tag",
    "Button"
  ]
}

---

## Menu

Source: menu.html · Status: Available

Components · Navigation

# Menu
  
A floating panel listing clickable commands or actions - what appears when a dropdown trigger, a right-click, or a "..." button is activated.

## Menu type

Copy a ready-to-paste AI prompt or the working code - both use this system's own color tokens and Inter, never arbitrary values. Click the card to configure it in full.

            Edit
            Duplicate
            Archive
            Delete

Menu

          Copy prompt

---

## Modal

Source: modal-default.html · Status: Available

Components · Feedback · Modal
  Back to Modal types

# Modal
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
Use for a dialog box that appears above a dimmed backdrop to focus the user on one task or decision before returning them to the page - one Modal component, controlled by properties, not a one-off overlay built from scratch each time.

## Properties

Size, corner radius, title, body text, icon and action labels are properties of the same component, not separate dialogs glued together - change them below to check this modal's style and scenarios in the Live Preview. No footer, Scrollable and No close aren't separate properties here since they're not mutually exclusive states - pick any row by name from the Live Preview's own State selector to see that combination (e.g. Scrollable + No close together).

        Size
        
          Small
          Medium
          Large

        Corner radius

        Title

        Heading level
        
          H1
          H2
          H3
          H4
          H5
          H6

        Body

        Confirm label

        Cancel label

        Show close button

          shown in the title bar

        Show icon

          shown beside the title

## Live Preview
    
All 2 types compared side by side, each across 7 representative scenarios - Default, No footer, Scrollable, No close, Scrollable + No close (proving they combine), Loading, and Error - at the chosen Size, title and body text. One full matrix is rendered per selected Corner radius.

## Confirm-type shortcuts
    
Ant's Modal.info/.success/.warning/.error/.confirm - a pre-built icon-plus-title-plus-single-button shape for the moment a caller just needs to say one thing and move on, without re-declaring the header/footer boilerplate every time. Only Modal.confirm gets a Cancel button; the other four are acknowledge-only.

## When to use
    
Any moment that needs to block the rest of the page until the user makes a decision or finishes a short, focused task.

      Destructive confirmation
      Form in a focused flow
      Terms acceptance
      Onboarding step
      Media preview

## Component Guide

        Human View
        Machine View

Overview
      
Modal is a dialog box that appears above a dimmed backdrop to focus the user on one task or decision before returning them to the page - it blocks interaction with everything behind it until the user responds or explicitly closes it.

When to Use

- A destructive-action confirmation - confirming a delete before it happens.
        
- A short, focused task or form - terms acceptance, an onboarding step.
        
- A media preview that needs full attention - viewing an image or document in detail.

When Not to Use

- A task that needs more room than a dialog comfortably allows - use Drawer, which slides in from an edge instead of interrupting the whole page.
        
- A brief, non-blocking confirmation - use Toast or Alert - Modal's backdrop is a heavy interruption for something minor.
        
- Frequent or repeated interruptions in a single flow - excessive modal use breaks flow; consider inline validation or a Drawer instead.

Best Practices

- Give it a single clear purpose and a single primary action - avoid turning it into a small multi-purpose page.
        
- Always provide an obvious way to close it (a visible close button and Escape), even when a primary action is required.
        
- Keep destructive confirmations short and specific about the consequence, not a generic "Are you sure?"

Do and Don't

Do

Delete 3 files?

This cannot be undone.
CancelDelete
          
One decision, stated with its consequence, and a button that names the action rather than agreeing vaguely.

Don't

Are you sure?

Please confirm.
NoYes
          
"Are you sure?" with Yes/No never says what is about to happen, so the user confirms without knowing what they agreed to.

Accessibility

- Traps keyboard focus within the dialog while open, and restores it to the triggering element on close.
        
- Exposed as role="dialog" with aria-modal="true" and an accessible name (its title via aria-labelledby), announced as soon as it opens - this is about focus management and interruption, not aria-live, since a Modal blocks and demands a response rather than passively announcing a status.
        
- Escape always closes it, no matter the type or state. A visible close "x" is also available for Default and Destructive, unless explicitly hidden via the Show close property or the No-close state.

Related Components
      
Drawer, Pop Confirm, Result.

{
  "component": "Modal",
  "category": "Feedback",
  "summary": "Modal is a dialog box that appears above a dimmed backdrop to focus the user on one task or decision before returning them to the page - it blocks interaction with everything behind it until the user responds or explicitly closes it.",
  "whenToUse": [
    "A destructive-action confirmation - confirming a delete before it happens.",
    "A short, focused task or form - terms acceptance, an onboarding step.",
    "A media preview that needs full attention - viewing an image or document in detail."
  ],
  "whenNotToUse": [
    "A task that needs more room than a dialog comfortably allows - use Drawer, which slides in from an edge instead of interrupting the whole page.",
    "A brief, non-blocking confirmation - use Toast or Alert - Modal's backdrop is a heavy interruption for something minor.",
    "Frequent or repeated interruptions in a single flow - excessive modal use breaks flow; consider inline validation or a Drawer instead."
  ],
  "bestPractices": [
    "Give it a single clear purpose and a single primary action - avoid turning it into a small multi-purpose page.",
    "Always provide an obvious way to close it (a visible close button and Escape), even when a primary action is required.",
    "Keep destructive confirmations short and specific about the consequence, not a generic \"Are you sure?\""
  ],
  "doAndDont": {
    "do": "One decision, stated with its consequence, and a button that names the action rather than agreeing vaguely.",
    "dont": "\"Are you sure?\" with Yes/No never says what is about to happen, so the user confirms without knowing what they agreed to."
  },
  "accessibility": [
    "Traps keyboard focus within the dialog while open, and restores it to the triggering element on close.",
    "Exposed as role=\"dialog\" with aria-modal=\"true\" and an accessible name (its title via aria-labelledby), announced as soon as it opens - this is about focus management and interruption, not aria-live, since a Modal blocks and demands a response rather than passively announcing a status.",
    "Escape always closes it regardless of type or state. A visible close \"x\" is also available for Default and Destructive unless explicitly hidden."
  ],
  "relatedComponents": [
    "Drawer",
    "Pop Confirm",
    "Result"
  ]
}

---

## Modal

Source: modal.html · Status: Available

Components · Feedback

# Modal
  
A dialog box that appears above a dimmed page backdrop, blocking interaction with the rest of the page until dismissed or actioned - focuses the user on one task or decision before returning them to what they were doing.

## Modal type

Copy a ready-to-paste AI prompt or the working code - both use this system's own color tokens and Inter, never arbitrary values. Click the card to configure it in full.

                Delete this file?
                ×

This action cannot be undone.

                Cancel
                Delete

System Control

          Copy prompt

---

## What will you build today?

Source: new-project.html · Status: Available

Let’s make something great.

Welcome to Agentic Design System

# What will you build today?
    
Start a new design system or pick up where you left off.

      Existing project
      New project

    ←
    ✦

## Design companion
Let’s build your design system
    
Your brief 0Cancel

- 01Project
- 02About you
- 03Design
- 04Review

          ✦

            Design companion

### 

✦

          ✦
          
Design companion

### Your brief. Ready to build?
            
Review your choices. You can change any answer before we set things up.

Confirm & createEdit my answers

Your reply

↶Enter to send · Shift + Enter for a new lineSend

      Your project brief 0
      
Built from your answers. Editable at any time.
      
0 of 11 answers

✦
From brief to foundations
Your brand, layout and components start with the choices you make here.

✦
    
Made for your project

### Setting up your design system
    
Turning your answers into your project’s Foundation settings.

Retry setupBack to summary
    
Open my design systemReview Foundations

## Your project is ready
    
 — your saved project and Foundation settings.

Review FoundationsExport handoffEdit project setup

Browse without setup

Project setup documentation

## Implementation contract

Saved validated choices override project recommendations, which override system defaults. This implementation contract governs static specimens. Resolved tokens in the current export are authoritative values. Component exceptions must name the affected role and reason.

### User and task flow
Every fresh or returning top-level visit starts at new-project.html with both project choices visible, including the launcher, directory index, local server root, direct bookmarks and reopened conversation URLs. Choose Existing project to search saved projects in the unified Overview project hub, or New project to open a full-height chatbot. Use a scrollable conversation with unboxed assistant messages, user reply bubbles and a reply composer anchored below it. Show Project, About you, Design and Review stages with the current stage marked. Use the library’s resolved type, color, radius, spacing and focus tokens. Ask project, product, platforms, identity and design preferences one question at a time. Single-choice option cards send immediately; show available descriptions and visual spacing/corner samples. Brand color supports a native color picker synchronized with the hex reply. The multi-select Platforms question shows a selected-count status and an explicit Continue button directly beneath its chips, disabled until the selection is valid; text replies support Enter to send and Shift+Enter for a new line, while focused buttons retain their native keyboard actions. Clicking a single-choice card takes precedence over any earlier typed choice. A brief typing transition introduces the next local question. Show the live editable project brief and answered-count progress in a persistent desktop side panel; on narrower screens keep pinned answers in a header-controlled panel with Escape and focus return. Summarize the complete brief and require explicit confirmation before saving. Show centered progress for actual brief, palette, typography/layout, component Foundation, theme and save operations. Save the profile and validated Foundation records together, preserving the previous project in local history. Overview lists saved projects, supports name search and reopening, shows unfinished drafts and the active project’s next Foundation/export action. Keep one contextual header action: New project when there is no draft, or Continue draft when unfinished work exists; library and guideline navigation stays in the sidebar. Legacy History URLs redirect to Overview after normal application entry; omit the redundant History navigation item.

### Navigation and recovery
Validate each submitted answer. Changing a pinned answer returns to the next unanswered question or summary without erasing other replies. Drafts preserve confirmed replies, unfinished input per question even while editing earlier answers, creation/edit intent and the source-project baseline. Batch text autosaves with a 200ms debounce; flush pending input on blur, page hide and backgrounding, and save selections and submissions immediately. Compare the stored draft and profile baseline before writing; conflicts cancel queued saves and cannot overwrite newer work. Cancel clears queued autosaves; selecting New project automatically restores a readable unfinished draft directly into the chatbot without a Resume/Discard screen. Failed saves restore previous project and Foundation records and retain the conversation. Reject stale cross-tab profile, draft or Foundation changes. Preserve unreadable and future records with backup/discard recovery. First entry never auto-opens a saved profile or draft; New project restores readable drafts directly; only unreadable or unsupported saved data requires a recovery screen. One-use in-app navigation handoffs preserve normal browsing and explicit editor reloads. Browser refresh starts at choices. Component preview frames retain their requested page.

### Context and readiness
Product and platforms inform Grid & Layout and Typography. Explicit brand color, spacing, corner-radius philosophy and icon style override recommendations. Confirmation authorizes the prepared Foundation settings and library defaults for remaining choices. Progress checkmarks reflect completed preparation or a verified save, never a simulated external AI request. All saved settings remain editable in Foundations; per-platform handoff guidance remains available.

### Categories and identity
Dashboard describes a data-focused product; Desktop web describes delivery. All project details are required for new saves. Older profiles remain readable until explicitly edited. Identity remains excluded from handoff unless opted in.

### Handoff
Export all nine Foundations, effective values in both themes, rules, font dependencies, icon-reference assets and unresolved acceptance checks. Do not claim a published release or send an invitation from a local example.

### Review and edit saved setup
Project setup navigation opens project-setup.html, where the active project’s eleven onboarding answers appear in Project details, About you and Design choices. Edit setup prefills the existing answers; Save changes validates and updates the same project, while Cancel preserves saved data. Project and identity edits do not reapply Foundation defaults. Changed brand, spacing, corners and icon choices patch only their corresponding Foundation records and preserve unrelated customizations. Respect unfinished onboarding drafts and cross-tab conflicts. New visits still enter through the welcome choices.
Machine contract: section rules, storage, units and acceptance
{
  "schemaVersion": 1,
  "authority": "Saved validated choices override project recommendations, which override system defaults. This implementation contract governs static specimens. Resolved tokens in the current export are authoritative values. Component exceptions must name the affected role and reason.",
  "governance": {
    "owners": "Design System Lead owns token and compatibility policy. Designers own specimens and interaction contracts. Developers own resolver/export/import parity. QA and Accessibility own release evidence. Product teams own domain-specific confidence, privacy and retention policies.",
    "changes": "Change the JSON contract first, regenerate documentation/defaults/catalog/tokens, then run model, DOM and recipient checks. Link the changed finding IDs and evidence in the release review.",
    "compatibility": "Keep hue-named CSS tokens as compatibility aliases while semantic consumers migrate. Additive tokens retain schemaVersion 1. A removed/renamed key or changed stored meaning requires a schema migration, a version bump and a documented replacement before release. Keep the prior reader fixture until the migration is verified.",
    "deprecation": "Record old key, replacement, reason, introduced version, planned removal version and affected consumers. Do not remove a token while an active consumer still uses it. Future records are preserved rather than coerced.",
    "scope": "This is a web design system with one shared workspace profile. Native dp/sp adaptation and real agent execution require separate adapters and acceptance. User-defined colors and responsive exceptions require product-specific rendered verification."
  },
  "storage": {
    "version": 1,
    "legacy": "Unversioned valid records migrate in memory. Typography headingScaleVersion 2 applies the smaller six-heading scale once to older records, retaining other roles and existing font/color/style metrics. Later custom size edits are retained. Unsupported future records are preserved. The next successful write stamps the migrated version.",
    "future": "Reject unsupported future versions. Preserve raw data. Offer backup and explicit reset.",
    "invalid": "Foundation selections preview locally until Save foundation succeeds. Saved Foundation editors require Edit foundation before changes. Cancel discards the preview. Invalid drafts never replace saved records; storage failures retain the editable preview and the last durable record.",
    "concurrency": "A storage event refreshes applied tokens and disables stale editor controls until reload. Never merge simultaneous edits silently."
  },
  "units": {
    "base": "1rem = 16px at default browser settings. Do not fix the root font size.",
    "use": "Prefer rem for typography, spacing and control dimensions. Hairline borders and viewport thresholds may use px. Both equivalents appear in Markdown. SVG strokes use viewBox units. Ratios, percentages, columns, timing and weights are unitless or retain their own units.",
    "native": "Web CSS px/rem are not native dp/sp. A native adapter must map semantic roles, support text scaling and test device density. Native rendering is not shipped by this web library."
  },
  "acceptance": [
    "Compare page, applied tokens, durable record, Machine View and exported instructions.",
    "Test valid, unfinished, invalid, missing, malformed, legacy and future records. Exercise storage failure, reset, reload and another tab.",
    "Test 320, 375, 768, 1024 and 1440px widths, 200% zoom, text-spacing overrides, RTL and long/localized labels.",
    "Use keyboard and screen reader. Confirm focus return, names, values, error associations and status announcements.",
    "Verify actual rendered text/surface pairs, forced colors, reduced motion, print and exported recipes in a recipient fixture. Source or DOM checks alone are not rendered acceptance."
  ],
  "layers": {
    "content": 0,
    "sticky": 20,
    "popover": 40,
    "scrim": 60,
    "dialog": 70,
    "toast": 80,
    "tooltip": 90,
    "rules": "Each overlay gets an explicit owner and close/focus-return path. Portal menus out of clipped scroll containers. Nested dialogs stack one scrim per modal owner. Escape closes the top dismissible layer. Tooltips never block actions. Test collision and zoom; do not infer stacking order from shadow size."
  },
  "section": {
    "title": "Project setup",
    "rules": {
      "User and task flow": "Every fresh or returning top-level visit starts at new-project.html with both project choices visible, including the launcher, directory index, local server root, direct bookmarks and reopened conversation URLs. Choose Existing project to search saved projects in the unified Overview project hub, or New project to open a full-height chatbot. Use a scrollable conversation with unboxed assistant messages, user reply bubbles and a reply composer anchored below it. Show Project, About you, Design and Review stages with the current stage marked. Use the library\u2019s resolved type, color, radius, spacing and focus tokens. Ask project, product, platforms, identity and design preferences one question at a time. Single-choice option cards send immediately; show available descriptions and visual spacing/corner samples. Brand color supports a native color picker synchronized with the hex reply. The multi-select Platforms question shows a selected-count status and an explicit Continue button directly beneath its chips, disabled until the selection is valid; text replies support Enter to send and Shift+Enter for a new line, while focused buttons retain their native keyboard actions. Clicking a single-choice card takes precedence over any earlier typed choice. A brief typing transition introduces the next local question. Show the live editable project brief and answered-count progress in a persistent desktop side panel; on narrower screens keep pinned answers in a header-controlled panel with Escape and focus return. Summarize the complete brief and require explicit confirmation before saving. Show centered progress for actual brief, palette, typography/layout, component Foundation, theme and save operations. Save the profile and validated Foundation records together, preserving the previous project in local history. Overview lists saved projects, supports name search and reopening, shows unfinished drafts and the active project\u2019s next Foundation/export action. Keep one contextual header action: New project when there is no draft, or Continue draft when unfinished work exists; library and guideline navigation stays in the sidebar. Legacy History URLs redirect to Overview after normal application entry; omit the redundant History navigation item.",
      "Navigation and recovery": "Validate each submitted answer. Changing a pinned answer returns to the next unanswered question or summary without erasing other replies. Drafts preserve confirmed replies, unfinished input per question even while editing earlier answers, creation/edit intent and the source-project baseline. Batch text autosaves with a 200ms debounce; flush pending input on blur, page hide and backgrounding, and save selections and submissions immediately. Compare the stored draft and profile baseline before writing; conflicts cancel queued saves and cannot overwrite newer work. Cancel clears queued autosaves; selecting New project automatically restores a readable unfinished draft directly into the chatbot without a Resume/Discard screen. Failed saves restore previous project and Foundation records and retain the conversation. Reject stale cross-tab profile, draft or Foundation changes. Preserve unreadable and future records with backup/discard recovery. First entry never auto-opens a saved profile or draft; New project restores readable drafts directly; only unreadable or unsupported saved data requires a recovery screen. One-use in-app navigation handoffs preserve normal browsing and explicit editor reloads. Browser refresh starts at choices. Component preview frames retain their requested page.",
      "Context and readiness": "Product and platforms inform Grid & Layout and Typography. Explicit brand color, spacing, corner-radius philosophy and icon style override recommendations. Confirmation authorizes the prepared Foundation settings and library defaults for remaining choices. Progress checkmarks reflect completed preparation or a verified save, never a simulated external AI request. All saved settings remain editable in Foundations; per-platform handoff guidance remains available.",
      "Categories and identity": "Dashboard describes a data-focused product; Desktop web describes delivery. All project details are required for new saves. Older profiles remain readable until explicitly edited. Identity remains excluded from handoff unless opted in.",
      "Handoff": "Export all nine Foundations, effective values in both themes, rules, font dependencies, icon-reference assets and unresolved acceptance checks. Do not claim a published release or send an invitation from a local example.",
      "Review and edit saved setup": "Project setup navigation opens project-setup.html, where the active project\u2019s eleven onboarding answers appear in Project details, About you and Design choices. Edit setup prefills the existing answers; Save changes validates and updates the same project, while Cancel preserves saved data. Project and identity edits do not reapply Foundation defaults. Changed brand, spacing, corners and icon choices patch only their corresponding Foundation records and preserve unrelated customizations. Respect unfinished onboarding drafts and cross-tab conflicts. New visits still enter through the welcome choices."
    }
  }
}

---

## Notification

Source: notification-default.html · Status: Available

Components · Feedback · Notification
  Back to Notification types

# Notification
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
Use for a corner-anchored card that reports a background or async event - an icon, bold title, longer description and a close button, with an optional action - one Notification component, controlled by properties, not separate cards glued together.

## Properties

Title and description are properties of the same component, not separate cards - change them below to check this notification's types and states in the Live Preview.

        Title

        Heading level
        
          H1
          H2
          H3
          H4
          H5
          H6

        Description

        Placement
        
          Top right
          Top left
          Bottom right
          Bottom left

## Live Preview
    
All 4 types compared side by side, each in all 3 states - Default, With action and Stacked. Uses the current title and description above.

## Placement
    
Which viewport corner the notification stacks in - its most central property, and the one thing a type x state matrix alone can never show. Multiple notifications in the same placement stack outward from the edge they anchor to.

## When to use
    
A background or async event that the user should learn about even if they aren't watching the page that triggered it.

      Background task completion
      Async upload/export result
      New message or mention alert
      System status change
      Multi-notification stack

## Component Guide

        Human View
        Machine View

Overview
      
Notification is a corner-anchored card that reports a background or async event - an icon, bold title, longer description, and a close button, with an optional action - used for events the user wasn't necessarily watching for, unlike Toast's brief confirmation of an action just taken.

When to Use

- A background task completing - an async upload or export finishing while the user was doing something else.
        
- A new message or mention alert - an event unrelated to what's currently on screen.
        
- A system status change or a stack of several notifications - more content or more persistence than Toast is built for.

When Not to Use

- A quick confirmation of an action the user just took - use Toast - it's lighter and self-dismisses faster.
        
- A message embedded in the page's own content flow - use Alert.
        
- A decision the user must make before continuing - use Modal or Pop Confirm - Notification is informational, not a blocking choice.

Best Practices

- Give it a real title and description, not just a one-line message - that extra structure is what distinguishes it from Toast.
        
- Stack multiple notifications clearly rather than replacing one before it's been read.
        
- Only include an action button when there's a genuinely useful next step (e.g. "View"), not by default.

Do and Don't

Do

Export finished
report-q1.csv is ready to download.
          
Reports a background job the user was not watching, with enough detail to act on later.

Don't

Saved
          
A one-word confirmation of something the user just did belongs in a Toast. Notification's weight is meant for events they did not initiate.

Accessibility

- Announced via an aria-live region so it reaches screen-reader users even if their focus is elsewhere on the page.
        
- The close control is independently focusable and labeled ("Dismiss notification").
        
- Persists long enough (or until manually dismissed) to be read in full, unlike Toast's short auto-dismiss window.

Related Components
      
Toast, Alert, Badge.

{
  "component": "Notification",
  "category": "Feedback",
  "summary": "Notification is a corner-anchored card that reports a background or async event - an icon, bold title, longer description, and a close button, with an optional action - used for events the user wasn't necessarily watching for, unlike Toast's brief confirmation of an action just taken.",
  "whenToUse": [
    "A background task completing - an async upload or export finishing while the user was doing something else.",
    "A new message or mention alert - an event unrelated to what's currently on screen.",
    "A system status change or a stack of several notifications - more content or more persistence than Toast is built for."
  ],
  "whenNotToUse": [
    "A quick confirmation of an action the user just took - use Toast - it's lighter and self-dismisses faster.",
    "A message embedded in the page's own content flow - use Alert.",
    "A decision the user must make before continuing - use Modal or Pop Confirm - Notification is informational, not a blocking choice."
  ],
  "bestPractices": [
    "Give it a real title and description, not just a one-line message - that extra structure is what distinguishes it from Toast.",
    "Stack multiple notifications clearly rather than replacing one before it's been read.",
    "Only include an action button when there's a genuinely useful next step (e.g. \"View\"), not by default."
  ],
  "doAndDont": {
    "do": "Reports a background job the user was not watching, with enough detail to act on later.",
    "dont": "A one-word confirmation of something the user just did belongs in a Toast. Notification's weight is meant for events they did not initiate."
  },
  "accessibility": [
    "Announced via an aria-live region so it reaches screen-reader users even if their focus is elsewhere on the page.",
    "The close control is independently focusable and labeled (\"Dismiss notification\").",
    "Persists long enough (or until manually dismissed) to be read in full, unlike Toast's short auto-dismiss window."
  ],
  "relatedComponents": [
    "Toast",
    "Alert",
    "Badge"
  ]
}

---

## Notification

Source: notification.html · Status: Available

Components · Feedback

# Notification
  
A richer, corner-anchored card - icon, bold title, longer description, a close button and an optional action - used to surface background or async events (e.g. "File uploaded successfully", "3 new messages received"), unlike Toast's brief, single-line transient confirmations.

## Notification type

Copy a ready-to-paste AI prompt or the working code - both use this system's own color tokens and Inter, never arbitrary values. Click the card to configure it in full.

File uploaded
              
team-report.pdf is ready to share.

System Control

          Copy prompt

---

## NPM Package Mockup

Source: npm-package.html · Status: Reference / planned

# NPM Package Mockup
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
Generating build artefacts and publishing them to a registry are different operations with different risk profiles - publishing is effectively irreversible. This page keeps them visually and functionally separate at every step.

## State machine
    
Failed is reachable from Building or Publishing, never skipped past. The install command is shown only in the Published state - offering npm install for an unbuilt or unpublished package produces a failed command and an immediate loss of trust.

Not configuredNo registry, scope, or authSet up
      
ConfiguredTarget known, nothing builtBuild package
      
BuildingBuild in progressView log · Cancel
      
BuiltArtefacts exist, not on a registryDownload · Dry run · Publish
      
PublishedLive on the registryCopy install · Bump & republish
      
FailedBuild or publish errorView log · Retry · Edit config

## Configuration example

Registry

Scope *

Example only: scope availability has not been checked
        
Package name *

→ @company/insureedge-design-system
Example only: package availability has not been checked
        
Access token *

Illustration only. No credentials are collected or stored by this page.

Package contents
          
Design tokensIconsComponents (React / TS / Tailwind)Themes

- Name validation - lowercase, no leading dot or underscore, no spaces, URL-safe, ≤ 214 characters, not a reserved or typo-squat name. Checked against the registry before Save is enabled.
      
- Never hard-code a company or package name - derive it from project configuration and allow override.

## Published state example

@company/insureedge-design-system Published

Package version3.2.0 · design system 3.2.0✓ in sync
          
Published23 Sep 2026, 14:20 by A. Dev
          
Size412 KB unpacked · 86 KB tarball

Example command only (package not verified): npm install @company/insureedge-design-system

## Version drift example

⚠ Package is 2 versions behind
        
Design system 3.4.0 · Package 3.2.0
        
Unpublished changes: 8 components, 14 tokens, 1 breaking change
        
Removing token color.primary.hover is a breaking change: the next compatible version number must be 4.0.0, rather than 3.4.0.

Version drift is shown plainly, never hidden - package and system versions drift, and hiding that produces the worst class of bug.

## Publish safety

- Dry run first - the exact file manifest, size, and semver bump are shown before any publish, with a diff of what changed since the last published version.
      
- Breaking-change gate - a removed or renamed token forces a MAJOR bump and requires typed confirmation of the version number.
      
- Permission gate - only Owner and DS Admin may publish.
      
- Audit - every build and publish writes to the History Activity log with actor, version, and outcome.
      
- Failure handling - the registry's actual error is surfaced (401 auth, 403 scope, 409 version exists, network) with a specific remedy, never a generic "failed".

✗ Couldn't publish to npmjs.com
        
Version 3.2.0 already exists on the registry. npm does not allow republishing an existing version. Publish as 3.2.1, or change the version.

---

## Number

Source: number-default.html · Status: Available

Components · Forms · Number
  Back to Number types

# Number
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
Use for collecting a single numeric value, like a quantity or age, optionally with stepper buttons to increment or decrement it.

## Properties

Size, corner radius, label, placeholder and the stepper are properties of the same component, not separate fields - change them below to check this field's style and states in the Live Preview.

        Size

        Corner radius

        Label

        Placeholder

        Show stepper

          up/down buttons on the right

        Allow clear

          × button once filled

        Minimum value

        Maximum value

        Step value

        Required

          shows a required indicator

        Supporting text

          shown below the field

        Supporting text

        Error message

## Live Preview
    
All 3 types compared side by side, each in all 6 states. One full matrix is rendered per selected combination of Size and Corner radius - check more than one option in a dropdown to see every combination side by side.

## When to use
    
Any form field that collects a single numeric value - quantities, ages, prices, or counts.

      Quantity
      Age
      Price
      Rating count
      Guest count

## Validation
    
Number carries a format contract on top of the usual required-field rules - what counts as a valid character, when an out-of-range value gets flagged, and how the error names the actual constraint.

- Required marking - mark a required Number field the same way as any other required field in this system (red asterisk after the label).
      
- Validation timing - reject non-numeric characters at input time, so a letter or symbol never lands in the field to begin with. Min/max/step range checks are different: validate those on blur, not on every keystroke - flagging "5" as too low while the user is still about to type "50" is hostile and simply wrong.
      
- Error message - name the actual constraint that failed: "Enter a value between 1 and 100" or "Must be a multiple of 5," never a generic "Invalid number."
      
- Recovery - when the stepper is shown, clicking +/- from an out-of-range value snaps it to the nearest valid boundary, giving the user a one-click fix instead of forcing a full retype.

## Component Guide

        Human View
        Machine View

Overview
      
Number is a text field restricted to numeric input, optionally paired with stepper buttons to increment or decrement the value by a fixed amount - used anywhere the value is fundamentally a quantity rather than arbitrary text.

When to Use

- A quantity someone adjusts up or down - cart quantity, guest count.
        
- Any purely numeric value - age, price, a rating count.
        
- A bounded value with a sensible min/max and step - where steppers make small adjustments faster than typing.

When Not to Use

- A number that's really an identifier, not a quantity - a phone number, a ZIP/postal code, a credit card number - use Input, since these are never incremented/decremented and often contain formatting characters.
        
- A value that should be picked from a fixed list - use Select.
        
- A range of two numbers - consider Slider for a bounded range with no need for exact keyboard entry.

Best Practices

- Set sensible min/max/step values that match the real-world constraint (e.g. quantity can't go below 1).
        
- Keep the stepper buttons a secondary input method - typing a value directly should always work too.
        
- Show units alongside the field (e.g. "kg", "$") rather than expecting the number alone to communicate meaning.

Do and Don't

Do

Quantity
+-
1 to 20 per order.
          
Steppers for a small count the user nudges, with the permitted range stated up front.

Don't

Salary
+-
          
Steppers on a value in the tens of thousands are useless - nobody clicks up from zero. Drop them when the step is not a unit the user thinks in.

Accessibility

- Uses the native numeric input semantics so mobile keyboards default to a numeric layout automatically.
        
- Stepper buttons are separately focusable and labeled ("Increase quantity" / "Decrease quantity"), not just plus/minus icons.
        
- Min/max boundaries are announced or otherwise communicated, not just silently enforced.

Related Components
      
Input, Slider, Rating.

{
  "component": "Number",
  "category": "Forms",
  "summary": "Number is a text field restricted to numeric input, optionally paired with stepper buttons to increment or decrement the value by a fixed amount - used anywhere the value is fundamentally a quantity rather than arbitrary text.",
  "whenToUse": [
    "A quantity someone adjusts up or down - cart quantity, guest count.",
    "Any purely numeric value - age, price, a rating count.",
    "A bounded value with a sensible min/max and step - where steppers make small adjustments faster than typing."
  ],
  "whenNotToUse": [
    "A number that's really an identifier, not a quantity - a phone number, a ZIP/postal code, a credit card number - use Input, since these are never incremented/decremented and often contain formatting characters.",
    "A value that should be picked from a fixed list - use Select.",
    "A range of two numbers - consider Slider for a bounded range with no need for exact keyboard entry."
  ],
  "bestPractices": [
    "Set sensible min/max/step values that match the real-world constraint (e.g. quantity can't go below 1).",
    "Keep the stepper buttons a secondary input method - typing a value directly should always work too.",
    "Show units alongside the field (e.g. \"kg\", \"$\") rather than expecting the number alone to communicate meaning."
  ],
  "doAndDont": {
    "do": "Steppers for a small count the user nudges, with the permitted range stated up front.",
    "dont": "Steppers on a value in the tens of thousands are useless - nobody clicks up from zero. Drop them when the step is not a unit the user thinks in."
  },
  "accessibility": [
    "Uses the native numeric input semantics so mobile keyboards default to a numeric layout automatically.",
    "Stepper buttons are separately focusable and labeled (\"Increase quantity\" / \"Decrease quantity\"), not just plus/minus icons.",
    "Min/max boundaries are announced or otherwise communicated, not just silently enforced."
  ],
  "relatedComponents": [
    "Input",
    "Slider",
    "Rating"
  ]
}

---

## Number

Source: number.html · Status: Available

Components · Forms

# Number
  
A single-line field restricted to numeric input, like a quantity or age, with optional increment and decrement stepper buttons.

## Number type

Copy a ready-to-paste AI prompt or the working code - both use this system's own color tokens and Inter, never arbitrary values. Click the card to configure it in full.

            Quantity

Number Field

          Copy prompt

---

## Overview

Source: overview.html · Status: Available

# Overview
Your design systems, ready to pick up where you left off.
    New project

      Search projects

Projects saved in this browser. Shared team projects are not connected yet.

## No saved projects yet
      
Choose New project above to create your first design system.
      Clear search

---

## Pagination

Source: pagination-default.html · Status: Available

Components · Navigation · Pagination
  Back to Pagination types

# Pagination
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
Use for navigating through pages of a large result set, like search results or a data table - one Pagination component, controlled by properties, not separate buttons glued together.

## Properties

Size and corner radius are properties of the same component, not separate buttons - change them below to check this control's style and states in the Live Preview. Page numbers and the "Page X of Y" count shown are fixed reference content, not editable properties.

        Size

        Corner radius

## Live Preview
    
Both types compared side by side, each in all 5 states - for Numbered, the state applies to the first page-number button while page 3 always stays the current page; for Simple, the state applies to the Prev arrow. Loading replaces the page numbers (or the "Page X of Y" text) with a spinner. One full matrix is rendered per selected combination of Size and Corner radius.

## When to use
    
Any large result set that's been split across multiple pages and needs a way to move between them.

      Search results
      Data table
      Product listing
      Blog archive

## Component Guide

        Human View
        Machine View

Overview
      
Pagination lets someone navigate through pages of a large result set, like search results or a data table - numbered page controls (or a simple Prev/Next pair) plus a page count, so a huge dataset stays browsable without loading everything at once.

When to Use

- Search results split across pages - a results list too long to show all at once.
        
- A data table with many rows - an admin grid or report view.
        
- A product listing or blog archive - any large, ordered collection browsed a page at a time.

When Not to Use

- A small result set that fits on one screen - pagination adds unnecessary interaction for a handful of items.
        
- A feed the user scrolls continuously through - use infinite scroll or a "load more" pattern instead of discrete pages, if that better matches the content type.
        
- Navigating between unrelated sections of a product - use Tabs, a nav bar, or Breadcrumb - Pagination is only for moving within one ordered result set.

Best Practices

- Always show which page is currently active and, when feasible, the total number of pages or results.
        
- Provide direct jump controls (first/last, or a page-number input) for very large result sets, not just Prev/Next.
        
- Keep the control's position consistent (commonly below the content it paginates) across every paginated view.

Do and Don't

Do
          
‹123›128 results
          
The current page is visibly distinct and the total result count is stated, so the user knows both where they are and how much further there is.

Don't
          
‹123›
          
With no page marked current, the control on its own cannot tell the user which of the results they are currently looking at.

Accessibility

- The current page is marked with aria-current="page", not communicated by color alone.
        
- Prev/Next controls have clear accessible names ("Previous page", "Next page"), not just arrow glyphs.
        
- Disabled Prev/Next controls (on the first or last page) use the native disabled state so they're correctly skipped by assistive technology.

Related Components
      
Table, List, Tabs.

{
  "component": "Pagination",
  "category": "Navigation",
  "summary": "Pagination lets someone navigate through pages of a large result set, like search results or a data table - numbered page controls (or a simple Prev/Next pair) plus a page count, so a huge dataset stays browsable without loading everything at once.",
  "whenToUse": [
    "Search results split across pages - a results list too long to show all at once.",
    "A data table with many rows - an admin grid or report view.",
    "A product listing or blog archive - any large, ordered collection browsed a page at a time."
  ],
  "whenNotToUse": [
    "A small result set that fits on one screen - pagination adds unnecessary interaction for a handful of items.",
    "A feed the user scrolls continuously through - use infinite scroll or a \"load more\" pattern instead of discrete pages, if that better matches the content type.",
    "Navigating between unrelated sections of a product - use Tabs, a nav bar, or Breadcrumb - Pagination is only for moving within one ordered result set."
  ],
  "bestPractices": [
    "Always show which page is currently active and, when feasible, the total number of pages or results.",
    "Provide direct jump controls (first/last, or a page-number input) for very large result sets, not just Prev/Next.",
    "Keep the control's position consistent (commonly below the content it paginates) across every paginated view."
  ],
  "doAndDont": {
    "do": "The current page is visibly distinct and the total result count is stated, so the user knows both where they are and how much further there is.",
    "dont": "With no page marked current, the control on its own cannot tell the user which of the results they are currently looking at."
  },
  "accessibility": [
    "The current page is marked with aria-current=\"page\", not communicated by color alone.",
    "Prev/Next controls have clear accessible names (\"Previous page\", \"Next page\"), not just arrow glyphs.",
    "Disabled Prev/Next controls (on the first or last page) use the native disabled state so they're correctly skipped by assistive technology."
  ],
  "relatedComponents": [
    "Table",
    "List",
    "Tabs"
  ]
}

---

## Pagination

Source: pagination.html · Status: Available

Components · Navigation

# Pagination
  
A row of page-number controls for navigating through a large result set, with one page always shown as current.

## Pagination type

Copy a ready-to-paste AI prompt or the working code - both use this system's own color tokens and Inter, never arbitrary values. Click the card to configure it in full.

            1
            2
            3

Pagination

          Copy prompt

---

## Password

Source: password-default.html · Status: Available

Components · Forms · Password
  Back to Password types

# Password
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
Use for collecting a secret value that should stay hidden while typing, like a password, passphrase, or PIN.

## Properties

Size, corner radius, label, placeholder and the reveal toggle are properties of the same component, not separate fields - change them below to check this field's style and states in the Live Preview.

        Size

        Corner radius

        Label

        Placeholder

        Show reveal toggle

          eye icon on the right

        Allow clear

          × button once filled

        Minimum length

        Maximum length

        Required

          shows a required indicator

        Supporting text

          shown below the field

        Supporting text

        Error message

## Live Preview
    
All 3 types compared side by side, each in all 6 states. One full matrix is rendered per selected combination of Size and Corner radius - check more than one option in a dropdown to see every combination side by side.

## When to use
    
Any form field that collects a secret value the user is typing, where the characters should stay hidden by default.

      Login
      Sign up
      PIN code
      Change password
      API key

## Validation
    
Password carries the same validation contract as any required field, plus rules specific to secrets - what counts as a valid value, when to check it, and how to keep autofill and password managers working rather than fighting them.

- Required marking - mark a required password field the same way as any other required field in this system (red asterisk after the label) - this is separate from and in addition to the reveal toggle, which is about visibility, not requiredness.
      
- Validation timing - never flag length or format errors while the user is still typing; validating on every keystroke reads as hostile and punishes someone mid-password. Check on blur or on submit instead. A live, non-error checklist of requirements met so far (green checks, not red errors) is fine and encouraged if space allows - it affirms progress without accusing the user of a mistake they haven't finished making.
      
- Autofill and paste - set the correct autocomplete value (current-password on login, new-password on signup or change-password) so browser and OS autofill and password managers can fill the field correctly. A value placed by autofill or paste must be validated exactly like one typed by hand - never skip or weaken validation just because the value didn't arrive via keystrokes. Per WCAG 2.2 Success Criterion 3.3.8 (Accessible Authentication - Minimum), the field or flow must never require solving a cognitive-function test - transcribing a puzzle, remembering something from elsewhere, doing mental math - as the only way to authenticate, so pasting the password or accepting a password-manager fill must always work; never attach paste-blocking oncopy/onpaste handlers to this field.
      
- Error message - state the rule directly and specifically: "Password must be at least 12 characters," not "Invalid password" or "Oops! Something went wrong." The user should be able to fix the value from the message alone, without guessing at what "invalid" means.
      
- Recovery - the show/hide reveal toggle is the primary recovery aid for a failed validation: let the user reveal what they actually typed and compare it against the error message, rather than clearing the field and forcing them to retype blind.

## Component Guide

        Human View
        Machine View

Overview
      
Password is a text field that masks its characters by default, with a toggle to reveal the value temporarily - used for any secret the user is actively typing, so it stays hidden from anyone glancing at the screen while still letting the user verify what they typed.

When to Use

- Login and sign-up forms - collecting an account password.
        
- A PIN code or short secret - still worth masking even if numeric.
        
- Changing a password or entering an API key - any value that shouldn't be visible by default.

When Not to Use

- A value that isn't actually secret - use Input - masking non-sensitive data only adds friction.
        
- A one-time code delivered separately and meant to be read back to someone - consider whether masking helps or just adds a step; a plain Input or Number field may serve better.
        
- Multi-line secret content - Password is single-line only; there's no dedicated masked textarea in this system.

Best Practices

- Always provide the show/hide toggle - masking with no way to verify what was typed increases error rates and failed submissions.
        
- Never restrict paste into a password field; blocking paste actively discourages the use of password managers.
        
- Show password strength or requirement feedback near the field, not only after a failed submit.

Do and Don't

Do

Password

At least 12 characters.
          
States the rule before the user types, and lets them reveal what they entered so a typo is fixable rather than guessable.

Don't

Password

Password does not meet requirements.
          
Hiding the rule until after submission, with no way to see what was typed, makes the user retry blind against a standard they still have not been told.

Accessibility

- The show/hide toggle has an accessible name that reflects its current state ("Show password" / "Hide password"), not just an icon.
        
- Toggling visibility keeps keyboard focus on the field, so the user isn't forced to re-locate it.
        
- The input still exposes autocomplete hints (current-password / new-password) so password managers can assist correctly.

Related Components
      
Input, Number (for PIN-style numeric-only secrets), Text Area.

{
  "component": "Password",
  "category": "Forms",
  "summary": "Password is a text field that masks its characters by default, with a toggle to reveal the value temporarily - used for any secret the user is actively typing, so it stays hidden from anyone glancing at the screen while still letting the user verify what they typed.",
  "whenToUse": [
    "Login and sign-up forms - collecting an account password.",
    "A PIN code or short secret - still worth masking even if numeric.",
    "Changing a password or entering an API key - any value that shouldn't be visible by default."
  ],
  "whenNotToUse": [
    "A value that isn't actually secret - use Input - masking non-sensitive data only adds friction.",
    "A one-time code delivered separately and meant to be read back to someone - consider whether masking helps or just adds a step; a plain Input or Number field may serve better.",
    "Multi-line secret content - Password is single-line only; there's no dedicated masked textarea in this system."
  ],
  "bestPractices": [
    "Always provide the show/hide toggle - masking with no way to verify what was typed increases error rates and failed submissions.",
    "Never restrict paste into a password field; blocking paste actively discourages the use of password managers.",
    "Show password strength or requirement feedback near the field, not only after a failed submit."
  ],
  "doAndDont": {
    "do": "States the rule before the user types, and lets them reveal what they entered so a typo is fixable rather than guessable.",
    "dont": "Hiding the rule until after submission, with no way to see what was typed, makes the user retry blind against a standard they still have not been told."
  },
  "accessibility": [
    "The show/hide toggle has an accessible name that reflects its current state (\"Show password\" / \"Hide password\"), not just an icon.",
    "Toggling visibility keeps keyboard focus on the field, so the user isn't forced to re-locate it.",
    "The input still exposes autocomplete hints (current-password / new-password) so password managers can assist correctly."
  ],
  "relatedComponents": [
    "Input",
    "Number",
    "Text Area"
  ]
}

---

## Password

Source: password.html · Status: Available

Components · Forms

# Password
  
A masked single-line field for secret input, like passwords or PINs - the entered characters are hidden by default.

## Password type

Copy a ready-to-paste AI prompt or the working code - both use this system's own color tokens and Inter, never arbitrary values. Click the card to configure it in full.

            Password

Password Field

          Copy prompt

---

## Pop Confirm

Source: pop-confirm-default.html · Status: Available

Components · Feedback · Pop Confirm
  Back to Pop Confirm types

# Pop Confirm
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
Use to ask a short "are you sure?" question right next to the trigger that caused it, with Confirm/Cancel buttons inline in the popover - one Pop Confirm component, controlled by properties, not a one-off floating panel built from scratch each time.

## Properties

Question text, Confirm label and Cancel label are properties of the same component, not separate confirmations built by hand - change them below to check every placement and state in the Live Preview.

        Question text

        Heading level
        
          H1
          H2
          H3
          H4
          H5
          H6

        Confirm label

        Cancel label

## Live Preview
    
All 4 placements compared side by side, each in 3 states - Default (neutral Confirm button), Destructive (Confirm button styled in the danger color) and With icon (a warning icon before the question). One matrix is rendered at the chosen Question text, Confirm label and Cancel label setting.

## When to use
    
Any lightweight "are you sure?" moment anchored to the element that triggered it, where a full Modal would be overkill.

      Delete/remove confirmation
      Discard unsaved changes
      Leave page confirmation
      Bulk action confirmation
      Irreversible toggle confirmation

## Component Guide

        Human View
        Machine View

Overview
      
Pop Confirm asks a short "are you sure?" question right next to the trigger that caused it, with Confirm/Cancel buttons inline in the popover - a lightweight alternative to a full Modal for confirmations that don't need to fully block the page.

When to Use

- A delete or remove confirmation on a single row or item - anchored right at the action that triggered it.
        
- Discarding unsaved changes or leaving a page - a quick check before a potentially costly action.
        
- A bulk action or an irreversible toggle confirmation - still simple enough not to need a full dialog.

When Not to Use

- A decision with real complexity or multiple fields - use Modal - Pop Confirm is for a single yes/no question, not a form.
        
- An action with severe, hard-to-reverse consequences at scale - consider a full Modal with more explicit warning copy for genuinely high-stakes confirmations.
        
- Something that isn't actually a confirmation - use Popover for general contextual content that isn't a yes/no decision.

Best Practices

- Keep the question and both button labels short and specific ("Delete this file?" / "Delete" / "Cancel").
        
- Anchor it directly to the triggering control so the connection between action and confirmation is obvious.
        
- Close it on an outside click or Escape without treating that as a confirmation either way.

Do and Don't

Do

Delete this file?
CancelDelete
          
A single yes-or-no question, anchored to the control that triggered it, with buttons that name the outcome.

Don't

Delete this file? Also remove it from shared folders, revoke links, and notify collaborators?
NoOK
          
Several decisions bundled into one question cannot be answered with one button. Once it needs this much explaining, use a Modal.

Accessibility

- Pop Confirm exists to gate a destructive or otherwise irreversible action, so its popover content carries role="alertdialog" rather than a plain popover/tooltip role - that's what gets its appearance and question announced together as a single interruption, instead of relying on the user to notice it visually.
        
- Focus moves into the alertdialog (typically onto the Cancel button, the safer default) when it opens, and returns to the exact triggering element when it closes, whether closed by Confirm, Cancel, Escape, or an outside click.
        
- The Confirm and Cancel buttons are distinguishable by more than color, especially when Confirm is destructive-styled.
        
- Escape closes it exactly like a Cancel, never like a silent Confirm.

Related Components
      
Modal, Popover, Tooltip.

{
  "component": "Pop Confirm",
  "category": "Feedback",
  "summary": "Pop Confirm asks a short \"are you sure?\" question right next to the trigger that caused it, with Confirm/Cancel buttons inline in the popover - a lightweight alternative to a full Modal for confirmations that don't need to fully block the page.",
  "whenToUse": [
    "A delete or remove confirmation on a single row or item - anchored right at the action that triggered it.",
    "Discarding unsaved changes or leaving a page - a quick check before a potentially costly action.",
    "A bulk action or an irreversible toggle confirmation - still simple enough not to need a full dialog."
  ],
  "whenNotToUse": [
    "A decision with real complexity or multiple fields - use Modal - Pop Confirm is for a single yes/no question, not a form.",
    "An action with severe, hard-to-reverse consequences at scale - consider a full Modal with more explicit warning copy for genuinely high-stakes confirmations.",
    "Something that isn't actually a confirmation - use Popover for general contextual content that isn't a yes/no decision."
  ],
  "bestPractices": [
    "Keep the question and both button labels short and specific (\"Delete this file?\" / \"Delete\" / \"Cancel\").",
    "Anchor it directly to the triggering control so the connection between action and confirmation is obvious.",
    "Close it on an outside click or Escape without treating that as a confirmation either way."
  ],
  "doAndDont": {
    "do": "A single yes-or-no question, anchored to the control that triggered it, with buttons that name the outcome.",
    "dont": "Several decisions bundled into one question cannot be answered with one button. Once it needs this much explaining, use a Modal."
  },
  "accessibility": [
    "Pop Confirm exists to gate a destructive or otherwise irreversible action, so its popover content carries role=\"alertdialog\" rather than a plain popover/tooltip role - that's what gets its appearance and question announced together as a single interruption, instead of relying on the user to notice it visually.",
    "Focus moves into the alertdialog (typically onto the Cancel button, the safer default) when it opens, and returns to the exact triggering element when it closes, whether closed by Confirm, Cancel, Escape, or an outside click.",
    "The Confirm and Cancel buttons are distinguishable by more than color, especially when Confirm is destructive-styled.",
    "Escape closes it exactly like a Cancel, never like a silent Confirm."
  ],
  "relatedComponents": [
    "Modal",
    "Popover",
    "Tooltip"
  ]
}

---

## Pop Confirm

Source: pop-confirm.html · Status: Available

Components · Feedback

# Pop Confirm
  
A small inline confirmation popover anchored to a trigger element, asking a short question with Confirm/Cancel buttons directly inside it - for lightweight "are you sure?" moments that don't warrant a full Modal.

## Pop Confirm type

Copy a ready-to-paste AI prompt or the working code - both use this system's own color tokens and Inter, never arbitrary values. Click the card to configure it in full.

Delete this item?

                No
                Yes

            Delete

Inline Confirmation Popover

          Copy prompt

---

## Popover

Source: popover-default.html · Status: Available

Components · Data Display · Popover
  Back to Popover types

# Popover
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
Use to show contextual details, a quick action or a small settings panel next to a trigger element, opened by a click rather than a hover - one Popover component, controlled by properties, not a one-off floating panel built from scratch each time.

## Properties

Trigger label, title and body text are properties of the same component, not separate popovers built by hand - change them below to check every placement and content state in the Live Preview.

        Trigger label

        Title

        Body

## Live Preview
    
All 4 placements compared side by side, each in 3 content states - Simple (title only), With body (title + body text) and With close (title + body + a close button). One matrix is rendered at the chosen Trigger label, Title and Body setting.

## When to use
    
Any richer floating content, beyond a short hint, that a user opts into by clicking a trigger rather than just hovering over it.

      Contextual details on click
      Inline help panel
      Quick actions menu
      Filter/settings mini-panel
      User info preview

## Component Guide

        Human View
        Machine View

Overview
      
Popover shows contextual details, a quick action, or a small settings panel next to a trigger element, opened by a click rather than a hover - richer and more persistent than Tooltip, since it stays open until the user dismisses it or clicks elsewhere.

When to Use

- Contextual details revealed on click - more information than a hover-only Tooltip can comfortably hold.
        
- An inline help panel or a quick-actions menu - a small floating panel anchored to its trigger.
        
- A filter/settings mini-panel or a user-info preview - richer content that benefits from staying open while the user reads or interacts with it.

When Not to Use

- A short, single-line hint - use Tooltip - Popover is heavier than a brief label needs.
        
- A yes/no confirmation with Confirm/Cancel actions - use Pop Confirm, which is purpose-built for that exact pattern.
        
- Content that should fully block the rest of the page - use Modal or Drawer instead of a lightweight anchored panel.

Best Practices

- Keep the content focused and scoped to what the trigger is about - a Popover shouldn't turn into a secondary page.
        
- Close it on outside click and Escape, consistent with other floating-panel components.
        
- Anchor it reliably to its trigger even as the page scrolls or resizes, so it never floats disconnected from context.

Do and Don't

Do

Storage almost full
92% used. Free up space or upgrade your plan.
ⓘ
          
A short title plus one or two lines of real detail - richer than a Tooltip, but still small enough to read at a glance.

Don't

Account settings
Full profile editing, notification preferences, connected apps, billing history and two-factor setup all live here - update anything and it saves immediately across every device you are signed into.
ⓘ
          
A popover this dense is really a page pretending to float. Once it needs paragraphs, send the user to a real settings screen instead.

Accessibility

- The trigger exposes aria-expanded and aria-haspopup, reflecting the popover's open state.
        
- Focus moves into the popover when it opens and returns to the trigger when it closes.
        
- Interactive content inside it (buttons, links) remains fully keyboard-reachable in a sensible tab order.

Related Components
      
Tooltip, Pop Confirm, Dropdown.

{
  "component": "Popover",
  "category": "Data Display",
  "summary": "Popover shows contextual details, a quick action, or a small settings panel next to a trigger element, opened by a click rather than a hover - richer and more persistent than Tooltip, since it stays open until the user dismisses it or clicks elsewhere.",
  "whenToUse": [
    "Contextual details revealed on click - more information than a hover-only Tooltip can comfortably hold.",
    "An inline help panel or a quick-actions menu - a small floating panel anchored to its trigger.",
    "A filter/settings mini-panel or a user-info preview - richer content that benefits from staying open while the user reads or interacts with it."
  ],
  "whenNotToUse": [
    "A short, single-line hint - use Tooltip - Popover is heavier than a brief label needs.",
    "A yes/no confirmation with Confirm/Cancel actions - use Pop Confirm, which is purpose-built for that exact pattern.",
    "Content that should fully block the rest of the page - use Modal or Drawer instead of a lightweight anchored panel."
  ],
  "bestPractices": [
    "Keep the content focused and scoped to what the trigger is about - a Popover shouldn't turn into a secondary page.",
    "Close it on outside click and Escape, consistent with other floating-panel components.",
    "Anchor it reliably to its trigger even as the page scrolls or resizes, so it never floats disconnected from context."
  ],
  "doAndDont": {
    "do": "A short title plus one or two lines of real detail - richer than a Tooltip, but still small enough to read at a glance.",
    "dont": "A popover this dense is really a page pretending to float. Once it needs paragraphs, send the user to a real settings screen instead."
  },
  "accessibility": [
    "The trigger exposes aria-expanded and aria-haspopup, reflecting the popover's open state.",
    "Focus moves into the popover when it opens and returns to the trigger when it closes.",
    "Interactive content inside it (buttons, links) remains fully keyboard-reachable in a sensible tab order."
  ],
  "relatedComponents": [
    "Tooltip",
    "Pop Confirm",
    "Dropdown"
  ]
}

---

## Popover

Source: popover.html · Status: Available

Components · Data Display

# Popover
  
A rich floating content panel with a title and body text, anchored to a trigger element and opened by clicking it - for more content than a simple Tooltip hint can hold.

## Popover type

Copy a ready-to-paste AI prompt or the working code - both use this system's own color tokens and Inter, never arbitrary values. Click the card to configure it in full.

Storage usage
              
8.2 GB of 15 GB used.

            Details

System Control

          Copy prompt

---

## Design Principles

Source: principles.html · Status: Available

# Design Principles
  
Four shared values and ten practical principles for clear, consistent interfaces. Use them to guide decisions across components and screens.

## Design values
    
Use these values when an existing rule does not settle a design decision. The examples below are static illustrations of the principles.

### Legible
Make information understandable at a glance. Use clear labels, explain empty states, indicate truncated content, and communicate status through more than color.

### Consistent
Give the same problem the same solution. Reuse shared foundations, component behavior and language so familiar patterns stay predictable.

### Honest
Show what the system is actually doing. Report real progress, make limitations clear, and use motion and elevation to communicate meaningful changes.

### Adaptive
Support the context people bring: screen size, input method, theme, reading direction and accessibility preferences. Build adaptation into each component.

## 1. Proximity
    
Spacing communicates relationship before a single label is read. Elements that belong together sit close; a group that doesn't relate to its neighbor gets a visibly larger gap - never the same gap used everywhere out of habit.

### Do

First name
Last name

Email
Phone
        
Small gaps within each pair and larger gaps between pairs make the grouping visible before any label is read.

### Don't

First name
Last name
Email
Phone
        
Equal gaps within and between groups make related fields harder to distinguish.

## 2. Alignment
    
Every edge should line up with another edge on purpose. An element positioned by eye rather than against a shared line creates a visual tie the reader has to resolve before they can read the content.

### Do

Company name
Tax ID
Billing email
        
Every field shares the same left edge and the same width - the column reads as one aligned unit.

### Don't

Company name
Tax ID
Billing email
        
Every field starts and ends at a slightly different point - nothing is broken, but the eye has to work to find the column that isn't there.

## 3. Contrast
    
The most important thing on a screen should be the most visually distinct thing on it. If two elements aren't equally important, don't give them equal visual weight - contrast is what lets a reader tell them apart without reading either one.

### Do
        
PublishDraft saved 2 minutes ago
        
One saturated Primary action against dim, small status text - the eye finds the action first, exactly once.

### Don't
        
PublishDraft saved 2 minutes ago
        
Status text bolded and sized to match the button competes with it for attention - now there are two things to look at with no way to tell which mattered more.

## 4. Repetition
    
A pattern solved once should be solved identically everywhere it recurs. Re-deriving a layout, a spacing value or a color per screen isn't creative variation - it's a second, slightly different rule the next designer now has to discover and reconcile.

### Do

Invoice #4021

Invoice #4022
        
Every row in the list uses the exact same card structure and spacing - no row asks to be looked at differently from its neighbor.

### Don't

Invoice #4021

Invoice #4022
        
The second row has different padding, corner radius and title weight for no reason tied to its content - the user now wonders if it means something.

## 5. Make it Direct
    
Let people act on the thing itself instead of routing them through a separate settings surface to change one property of it. The shorter the distance between seeing something and changing it, the less the interface is getting in the way.

### Do
        
Q1 Roadmapclick to rename
        
Clicking the title renames it in place - the object being edited and the control for editing it are the same element.

### Don't
        
Q1 RoadmapOpen settings to rename
        
Renaming a title routes through a separate settings surface for a change that has nothing to do with settings - three clicks for one word.

## 6. Stay on the Page
    
A small, contained task doesn't need to leave the page the user is already on. Full navigation resets their scroll position and working context for a job that a drawer or an inline panel could have handled without losing either.

### Do

Filters
        
Filtering opens a drawer beside the list - the list, scroll position and selection stay exactly where the user left them.

### Don't

← navigates away from the list entirelyGo to Filter Settings page
        
Sending the user to a whole new page to set one filter loses their place in the list they were just looking at.

## 7. Keep it Lightweight
    
Don't demand more setup than the task is worth. A five-field wizard before the user has seen any payoff teaches them the tool is a chore before it's had the chance to be useful.

### Do

Project name
Create
        
One field to get started - everything else (description, members, template) is filled in later, from inside the thing that now exists.

### Don't

Step 1 of 5
Project name

Description

A five-step wizard before the project even exists front-loads setup the user hasn't earned the payoff for yet.

## 8. Provide an Invitation
    
The next possible action should be visually discoverable before it's needed, through a subtle cue - a hover state, an icon that appears on proximity - not hidden until the user already knows to look for it.

### Do

Q1 Report.pdfRename · Delete
        
Row actions are visible - dimmed to stay out of the way, but present enough that the user knows they exist without hovering to discover them.

### Don't

Q1 Report.pdf(actions appear only on hover, with no visible cue)
        
Actions that exist only on hover, with nothing hinting they're there, are invisible on touch devices and undiscoverable everywhere else.

## 9. Use Transition
    
Use transitions to explain a change of state. Keep them brief, respect reduced-motion preferences, and never delay access to content or keyboard focus.

### Do

Shipping details
Expands with a height transition, so the content below visibly slides down rather than jumping into place.
        
In an implementation, a brief expansion can help people follow new content. With reduced motion, reveal it immediately and preserve their place.

### Don't

Shipping details(body would appear instantly, no transition, shifting everything below it in one frame)
        
Content snapping into existence with no transition shoves every element below it in one frame - disorienting on a long, scrolled page.

## 10. React Immediately
    
Acknowledge an action immediately, even when the work takes longer. Show a meaningful working state, prevent duplicate submissions where needed, and announce the result.

### Do
        
Saving…state changes the instant it's clicked
        
The button visibly enters a loading state the moment it's pressed, before the network call has even resolved - the click clearly registered.

### Don't
        
Save(nothing changes for 1-2s while the request is in flight)
        
A button that gives no feedback until the request finishes leaves the user unsure whether the click landed, and often clicking again.

## Use these principles
    
Copy this guide, or export it with your project brief and foundation settings.
    
Copy guideExport with project context

    Preview Markdown

## Implementation contract

Saved validated choices override project recommendations, which override system defaults. This implementation contract governs static specimens. Resolved tokens in the current export are authoritative values. Component exceptions must name the affected role and reason.

### Flow and use
Introduce shared values, then use eleven stable, keyboard-accessible section links for the values and ten principles. Do/Don’t examples are static illustrations; example inputs are read-only, named and outside the tab order. Describe transitions as implementation guidance and respect reduced-motion preferences. Apply principles through concrete component states, accessible reading order, reflow and recovery.

### Handoff
Keep one Copy guide action and a link to Markdown Export with project context. Collapse the duplicate Markdown preview by default; reveal and focus it if clipboard access fails. Export the merged values, principles and current rules without including export controls. Explain exceptions with the product constraint and verification evidence. A principle alone does not prove a component is accessible.

### Values
Introduce Legible, Consistent, Honest and Adaptive as shared decision-making values, followed by the ten practical principles. Keep one Design Principles navigation item; legacy Design Values links redirect to this introduction.
Machine contract: section rules, storage, units and acceptance
{
  "schemaVersion": 1,
  "authority": "Saved validated choices override project recommendations, which override system defaults. This implementation contract governs static specimens. Resolved tokens in the current export are authoritative values. Component exceptions must name the affected role and reason.",
  "governance": {
    "owners": "Design System Lead owns token and compatibility policy. Designers own specimens and interaction contracts. Developers own resolver/export/import parity. QA and Accessibility own release evidence. Product teams own domain-specific confidence, privacy and retention policies.",
    "changes": "Change the JSON contract first, regenerate documentation/defaults/catalog/tokens, then run model, DOM and recipient checks. Link the changed finding IDs and evidence in the release review.",
    "compatibility": "Keep hue-named CSS tokens as compatibility aliases while semantic consumers migrate. Additive tokens retain schemaVersion 1. A removed/renamed key or changed stored meaning requires a schema migration, a version bump and a documented replacement before release. Keep the prior reader fixture until the migration is verified.",
    "deprecation": "Record old key, replacement, reason, introduced version, planned removal version and affected consumers. Do not remove a token while an active consumer still uses it. Future records are preserved rather than coerced.",
    "scope": "This is a web design system with one shared workspace profile. Native dp/sp adaptation and real agent execution require separate adapters and acceptance. User-defined colors and responsive exceptions require product-specific rendered verification."
  },
  "storage": {
    "version": 1,
    "legacy": "Unversioned valid records migrate in memory. Typography headingScaleVersion 2 applies the smaller six-heading scale once to older records, retaining other roles and existing font/color/style metrics. Later custom size edits are retained. Unsupported future records are preserved. The next successful write stamps the migrated version.",
    "future": "Reject unsupported future versions. Preserve raw data. Offer backup and explicit reset.",
    "invalid": "Foundation selections preview locally until Save foundation succeeds. Saved Foundation editors require Edit foundation before changes. Cancel discards the preview. Invalid drafts never replace saved records; storage failures retain the editable preview and the last durable record.",
    "concurrency": "A storage event refreshes applied tokens and disables stale editor controls until reload. Never merge simultaneous edits silently."
  },
  "units": {
    "base": "1rem = 16px at default browser settings. Do not fix the root font size.",
    "use": "Prefer rem for typography, spacing and control dimensions. Hairline borders and viewport thresholds may use px. Both equivalents appear in Markdown. SVG strokes use viewBox units. Ratios, percentages, columns, timing and weights are unitless or retain their own units.",
    "native": "Web CSS px/rem are not native dp/sp. A native adapter must map semantic roles, support text scaling and test device density. Native rendering is not shipped by this web library."
  },
  "acceptance": [
    "Compare page, applied tokens, durable record, Machine View and exported instructions.",
    "Test valid, unfinished, invalid, missing, malformed, legacy and future records. Exercise storage failure, reset, reload and another tab.",
    "Test 320, 375, 768, 1024 and 1440px widths, 200% zoom, text-spacing overrides, RTL and long/localized labels.",
    "Use keyboard and screen reader. Confirm focus return, names, values, error associations and status announcements.",
    "Verify actual rendered text/surface pairs, forced colors, reduced motion, print and exported recipes in a recipient fixture. Source or DOM checks alone are not rendered acceptance."
  ],
  "layers": {
    "content": 0,
    "sticky": 20,
    "popover": 40,
    "scrim": 60,
    "dialog": 70,
    "toast": 80,
    "tooltip": 90,
    "rules": "Each overlay gets an explicit owner and close/focus-return path. Portal menus out of clipped scroll containers. Nested dialogs stack one scrim per modal owner. Escape closes the top dismissible layer. Tooltips never block actions. Test collision and zoom; do not infer stacking order from shadow size."
  },
  "section": {
    "title": "Design Principles",
    "rules": {
      "Flow and use": "Introduce shared values, then use eleven stable, keyboard-accessible section links for the values and ten principles. Do/Don\u2019t examples are static illustrations; example inputs are read-only, named and outside the tab order. Describe transitions as implementation guidance and respect reduced-motion preferences. Apply principles through concrete component states, accessible reading order, reflow and recovery.",
      "Handoff": "Keep one Copy guide action and a link to Markdown Export with project context. Collapse the duplicate Markdown preview by default; reveal and focus it if clipboard access fails. Export the merged values, principles and current rules without including export controls. Explain exceptions with the product constraint and verification evidence. A principle alone does not prove a component is accessible.",
      "Values": "Introduce Legible, Consistent, Honest and Adaptive as shared decision-making values, followed by the ten practical principles. Keep one Design Principles navigation item; legacy Design Values links redirect to this introduction."
    }
  }
}

---

## Progress

Source: progress-default.html · Status: Available

Components · Feedback · Progress
  Back to Progress types

# Progress
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
Use for showing how far a quantifiable operation has gotten toward completion, like an upload or a multi-step setup flow - one Progress component, controlled by properties, rendered as either a linear bar or a circular ring.

## Properties

Percent and label visibility are properties of the same component, not separate bars - change them below to check both layouts and every state in the Live Preview. Success is always complete regardless of Percent, and Error always shows a fixed, partial value, since those two states represent a finished or stalled operation rather than the live one Percent describes.

        Percent

        Show label

          shown alongside the bar or ring

## Live Preview
    
Both layouts compared side by side, each in all 3 states - In progress uses the current Percent value, Success is always complete at 100%, and Error is always a fixed, partial value at 40%.

## When to use
    
Any quantifiable operation where showing how much is done matters more than showing raw activity.

      File upload/download progress
      Multi-step onboarding completion
      Storage/quota usage
      Skill or profile completeness
      Long-running background task

## Component Guide

        Human View
        Machine View

Overview
      
Progress shows how far a quantifiable operation has gotten toward completion, like an upload or a multi-step setup flow, rendered as either a linear bar or a circular ring - used whenever a real percentage or fraction is known, unlike Spin which has no known completion point.

When to Use

- A file upload or download - a measurable percentage complete.
        
- Multi-step onboarding completion or storage/quota usage - a proportion of a known total.
        
- Skill/profile completeness or a long-running task with a known percentage - anywhere "how much is done" is the useful information.

When Not to Use

- An operation with no known duration or percentage - use Spin instead - Progress implies a measurable fraction, and showing a fake one is misleading.
        
- A step-based flow better represented by discrete stages than a continuous percentage - use Steps.
        
- A single instantaneous action with no meaningful "in progress" period - Progress adds nothing for actions that resolve immediately.

Best Practices

- Only show a percentage or fill amount that reflects real, measured progress - never a fake or purely cosmetic animation.
        
- Pair the bar/ring with a visible percentage or fraction label when precision matters to the user.
        
- Use the circular ring for compact spaces and the linear bar when there's room for a full-width indicator.

Do and Don't

Do

65%
          
One bar for the whole operation, carrying a real measured fraction, so the user can answer "how much longer" at a glance.

Don't

100%

40%

0%
          
A bar per sub-step makes the user add up the pieces to work out where the operation actually is. Report one number for the whole job.

Accessibility

- Exposed with role="progressbar", including aria-valuenow, aria-valuemin, and aria-valuemax - visible in the Do/Don't demo markup above - so assistive technology can read the current, minimum and maximum values on demand.
        
- No separate aria-live region is layered on top of role="progressbar": the widget's value attributes already let a screen reader announce progress when the user chooses to check it, and a role="progressbar" element is exposed with an implicit live-region-like behavior in most screen readers, so adding an explicit aria-live would just risk duplicate or overly chatty announcements as the value updates.
        
- Color is never the only way completion or error state is communicated.
        
- Updates are announced at reasonable intervals, not so frequently that they become noisy for screen-reader users.

Related Components
      
Spin, Skeleton, Steps.

{
  "component": "Progress",
  "category": "Feedback",
  "summary": "Progress shows how far a quantifiable operation has gotten toward completion, like an upload or a multi-step setup flow, rendered as either a linear bar or a circular ring - used whenever a real percentage or fraction is known, unlike Spin which has no known completion point.",
  "whenToUse": [
    "A file upload or download - a measurable percentage complete.",
    "Multi-step onboarding completion or storage/quota usage - a proportion of a known total.",
    "Skill/profile completeness or a long-running task with a known percentage - anywhere \"how much is done\" is the useful information."
  ],
  "whenNotToUse": [
    "An operation with no known duration or percentage - use Spin instead - Progress implies a measurable fraction, and showing a fake one is misleading.",
    "A step-based flow better represented by discrete stages than a continuous percentage - use Steps.",
    "A single instantaneous action with no meaningful \"in progress\" period - Progress adds nothing for actions that resolve immediately."
  ],
  "bestPractices": [
    "Only show a percentage or fill amount that reflects real, measured progress - never a fake or purely cosmetic animation.",
    "Pair the bar/ring with a visible percentage or fraction label when precision matters to the user.",
    "Use the circular ring for compact spaces and the linear bar when there's room for a full-width indicator."
  ],
  "doAndDont": {
    "do": "One bar for the whole operation, carrying a real measured fraction, so the user can answer \"how much longer\" at a glance.",
    "dont": "A bar per sub-step makes the user add up the pieces to work out where the operation actually is. Report one number for the whole job."
  },
  "accessibility": [
    "Exposed with role=\"progressbar\", including aria-valuenow, aria-valuemin, and aria-valuemax - visible in the Do/Don't demo markup - so assistive technology can read the current, minimum and maximum values on demand.",
    "No separate aria-live region is layered on top of role=\"progressbar\": the widget's value attributes already let a screen reader announce progress when the user chooses to check it, so an explicit aria-live would just risk duplicate or overly chatty announcements as the value updates.",
    "Color is never the only way completion or error state is communicated.",
    "Updates are announced at reasonable intervals, not so frequently that they become noisy for screen-reader users."
  ],
  "relatedComponents": [
    "Spin",
    "Skeleton",
    "Steps"
  ]
}

---

## Progress

Source: progress.html · Status: Available

Components · Feedback

# Progress
  
A visual indicator of completion percentage - either a horizontal bar that fills left-to-right or a circular ring that fills clockwise - with an optional percentage label, used for uploads, multi-step processes, loading operations, or any quantifiable completion state.

## Progress type

Copy a ready-to-paste AI prompt or the working code - both use this system's own color tokens and Inter, never arbitrary values. Click the card to configure it in full.

            65%

System Control

          Copy prompt

---

## Project setup

Source: project-setup.html · Status: Available

# Project setup
Your onboarding answers, all in one place. Review your brief and refine it as your project evolves.
    Edit setup

## No active project yet
Start a new project or open an existing design system to view its setup.
New projectExisting projects

Finish or cancel your unfinished onboarding conversation before editing this project.Continue conversation

Changes are saved when you choose Save changes.
CancelSave changes

---

## Radio

Source: radio-default.html · Status: Available

Components · Forms · Radio
  Back to Radio types

# Radio
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
Use for picking exactly one option from a small, visible set - like a payment method or a plan tier - where every option should stay visible at once instead of collapsing into a dropdown.

## Properties

Size and label are properties of the same component, not separate controls - change them below to check this radio's style and states in the Live Preview. Radios are always fully round, so there is no corner radius property.

        Size

        Label

        Label placement
        
          Right of radio
          Left of radio

        Required

          shows a required indicator

        Supporting text

          shown below the label

        Supporting text

        Error

          shown below the label

        Error message

## Live Preview
    
Both types compared side by side, each in all 5 states - one radio input per cell, since the matrix's job is to show what a single control looks like in each state, not a full mutually-exclusive group. One full matrix is rendered per selected Size.

## When to use
    
Any single choice from a small, fully visible set of mutually exclusive options.

      Payment method
      Shipping speed
      Single-choice survey question
      Plan tier

## Validation
    
A single radio button can't itself be "empty," so required marking and validation belong to the group as a whole, not to any option in it.

- Required marking - put the required indicator on the group's shared label or legend, never on one radio in the middle of the list.
      
- Validation timing - validate on submit; validating once the user has interacted with and left the whole group is also reasonable, but there's no meaningful per-item blur validation for a radio group.
      
- Error message - tie the message back to the group's question, "Choose a shipping method," rather than attaching it to a specific option.

## Component Guide

        Human View
        Machine View

Overview
      
Radio Button is for picking exactly one option from a small, fully visible set - every option stays on screen at once so the user can compare them directly, unlike Select, which hides the options behind a collapsed trigger.

When to Use

- A single choice among visible alternatives - payment method, shipping speed.
        
- A single-choice survey or form question - where seeing every option side by side helps the user decide.
        
- A plan or tier picker - a small set of comparable options.

When Not to Use

- More than one selection should be allowed - use Checkbox instead.
        
- A long list of options that would be unwieldy to show all at once - use Select.
        
- An instantly-applied single setting with no form submission - use Switch.

Best Practices

- Pre-select a sensible default when one genuinely exists, rather than leaving the group unselected.
        
- Keep the option set mutually exclusive and exhaustive - add an "Other" option if the list isn't complete.
        
- Align options in a single visual list (not a grid) when their order or relative ranking matters.

Do and Don't

Do

Standard - 3 to 5 days
Express - next day
          
A small set of mutually exclusive options, all visible, with one sensible default already chosen.

Don't

Email
SMS
          
Two radios selected at once is a state the control cannot actually reach. If more than one answer is valid, these should be Checkboxes.

Accessibility

- Options share one native group so only one can ever be checked, and arrow keys move both focus and selection between them.
        
- Each option's label is clickable and associated with its input.
        
- Every option shows a visible focus ring as keyboard focus moves through the group.

Related Components
      
Checkbox, Switch, Select, Group Button.

{
  "component": "Radio",
  "category": "Forms",
  "summary": "Radio Button is for picking exactly one option from a small, fully visible set - every option stays on screen at once so the user can compare them directly, unlike Select, which hides the options behind a collapsed trigger.",
  "whenToUse": [
    "A single choice among visible alternatives - payment method, shipping speed.",
    "A single-choice survey or form question - where seeing every option side by side helps the user decide.",
    "A plan or tier picker - a small set of comparable options."
  ],
  "whenNotToUse": [
    "More than one selection should be allowed - use Checkbox instead.",
    "A long list of options that would be unwieldy to show all at once - use Select.",
    "An instantly-applied single setting with no form submission - use Switch."
  ],
  "bestPractices": [
    "Pre-select a sensible default when one genuinely exists, rather than leaving the group unselected.",
    "Keep the option set mutually exclusive and exhaustive - add an \"Other\" option if the list isn't complete.",
    "Align options in a single visual list (not a grid) when their order or relative ranking matters."
  ],
  "doAndDont": {
    "do": "A small set of mutually exclusive options, all visible, with one sensible default already chosen.",
    "dont": "Two radios selected at once is a state the control cannot actually reach. If more than one answer is valid, these should be Checkboxes."
  },
  "accessibility": [
    "Options share one native group so only one can ever be checked, and arrow keys move both focus and selection between them.",
    "Each option's label is clickable and associated with its input.",
    "Every option shows a visible focus ring as keyboard focus moves through the group."
  ],
  "relatedComponents": [
    "Checkbox",
    "Switch",
    "Select",
    "Group Button"
  ]
}

---

## Radio

Source: radio.html · Status: Available

Components · Forms

# Radio
  
A small circular control for picking exactly one option from a mutually-exclusive group, like a payment method or a plan tier.

## Radio type

Copy a ready-to-paste AI prompt or the working code - both use this system's own color tokens and Inter, never arbitrary values. Click the card to configure it in full.

            Option A

Radio

          Copy prompt

---

## Radius

Source: radius.html · Status: Available

Foundations · Radius

# Radius
  
The corner-radius language every control, container and surface in this system borrows from - a visual signal of hierarchy, not just a rounded corner.

## What are you building?

        Human View
        Machine View

Pick the product type closest to yours and the recommended radius philosophy below updates to match - you can still choose a different one manually afterward.

        SaaS
        8px core · 12-16px container · Balanced

        Enterprise SaaS
        4-8px core · 8-12px container · Compact

        Web Application
        8px core · 12-16px container · Balanced

        Desktop Web (D-Web)
        6-8px core · 8-12px container · Structured

        Mobile Web (M-Web)
        8px core · 12-16px container · Soft

        Mobile Application
        8px core · 12-16px container · Friendly

        Dashboard
        4-8px core · 8-12px container · Dense

        Data-Heavy Application
        2-4px core · 4-8px container · Sharp

        Marketing Website
        12-16px core · 16-24px container · Expressive

        Consumer App
        12-16px core · 16-24px container · Soft

        AI Product
        8-12px core · 12-20px container · Modern

        Cross-Platform
        8px core · 12-16px container · Balanced

Recommended

{}

## Radius philosophy

        Human View
        Machine View

The corner-rounding character every control, card and surface in this system follows. Balanced is the starting preview. Choose the radius philosophy yourself, then select Save foundation. Project Setup does not select a radius for you.
    
Each tagline ("4-16px") names the characteristic core range - what most everyday controls actually look like under that philosophy - not the full set of values it makes available. Every philosophy's own scale below additionally always includes 0 (for the deliberate square-corner exceptions every philosophy still needs - a divider, a code block) and a generous top value or Full (for circular/pill elements - an avatar, a toggle thumb - which exist under every philosophy too). Neither is a contradiction of the tagline; both are values the tagline was never claiming to describe in the first place.

          Sharp
          0-4px

Precise and enterprise-focused. Best for: Enterprise / Finance / Data-heavy.
        
0, 2, 4, 6, 8

          Compact
          2-8px

Dense, professional and structured. Best for: Enterprise SaaS / Dashboards / B2B.
        
0, 2, 4, 6, 8, 12

          Balanced
          4-16px
          Recommended

Modern and flexible. Best for: SaaS / Web / Mobile / Cross-platform.
        
0, 2, 4, 6, 8, 12, 16, 24, Full

          Soft
          8-24px

Friendly and approachable. Best for: Consumer / Mobile / Customer-facing products.
        
0, 4, 8, 12, 16, 20, 24, Full

          Expressive
          12-32px+

Distinctive and brand-led. Best for: Creative / AI / Marketing / Consumer brands.
        
0, 4, 8, 12, 16, 24, 32, 40, 48, Full

{}

## Recommended global model

        Human View
        Machine View

Radius communicates hierarchy - smaller values read as precise and utilitarian, larger values read as container or emphasis.

Precision
2-4px

Interactive
4-8px

Container
8-16px

Large surface
16-24px

Pill / circle
Full

{}

## Radius by component role

        Human View
        Machine View

These values are Balanced's own resolved numbers (the default philosophy) for each named role slot, not a fixed literal promise across every philosophy. Every real component references the slot by name (--radius-md, not a literal 8px), so picking Sharp above doesn't drop "Interactive components" below the role's intended size tier - it reinterprets what that same slot resolves to under Sharp instead (4px, not 8px). The role stays the same; only the philosophy's own numbers behind it change.

        Micro components
        Small badge, tiny indicator, chip, compact control
        2, 4px

        Interactive components
        Button, input, select, checkbox, search field, dropdown - default 8px
        4, 6, 8px

        Content components
        Card, info panel, notification, form container - default 12px
        8, 12, 16px

        Large surfaces
        Modal, dialog, drawer, bottom sheet, dashboard container - default 16px
        12, 16, 24px

        Floating / overlay
        Popover, tooltip, dropdown menu, context menu - default 8px
        6, 8, 12px

Attachment changes which corners this role's radius actually applies to - a floating surface detached on all sides (a popover) rounds all four corners, but a surface attached to the viewport edge (a side drawer, a mobile bottom sheet) only rounds the corners that are actually free - the edge flush against the viewport uses 0 on that edge specifically, via CSS's own per-corner border-radius syntax (e.g. a bottom sheet: border-radius: 12px 12px 0 0), not a single uniform value forced onto all four corners. Shadows documents the same attached edge for its own purpose (still shadowed, just not rounded there) - this is the Radius half of that same rule. A surface that fills the entire viewport with no visible edge at all (a full-screen mobile modal) has no corner to round either way - radius is moot there, not 0 as a stated choice.
    
The circle-vs-pill rule above (Avatar/Icon Button/Toggle) isn't specific to those three components - it's this system's one standalone rule for the Full value generally: the exact same token renders as a true circle only when the element's own width equals its height, and as a stadium/pill shape on anything wider (or taller) than that - both are correct, intentional uses of Full, distinguished by the element's own aspect ratio, never by picking a different radius value for one versus the other.
    
A component's radius stays invariant across its own interactive states - hover, focus, error and selected change color, border and background, never the corner radius itself (confirmed: no state rule in this system's component CSS touches border-radius). A rounded shape that subtly changed radius when focused would read as movement, not feedback. The one real risk this invariance doesn't cover on its own: a rounded container using overflow: hidden (Card does, to keep its own content from spilling past its corners) can clip a focused child's outline if that child sits close enough to the edge - this system's own Card avoids it today with generous internal padding (14px, well past the ~4px a focus outline needs), but it's a constraint to check explicitly on any new rounded + clipped container, not something the invariance rule above guarantees by itself.

{}

## Component defaults

        Human View
        Machine View

        Button
        Compact enterprise 4px · expressive consumer 12px · pill uses Full
        8px

        Input / Select / Textarea
        Share one control radius across every form field
        8px

        Card
        Compact enterprise 8px · soft consumer 16px · expressive 20-24px
        12px

        Modal / Dialog
        Compact enterprise 12px · large/expressive 20-24px
        16px

        Badge
        Chip uses 8px; pill status uses Full - not every badge should be a pill
        4px

        Tooltip / Popover / Dropdown
        Keep floating surfaces tighter than content containers
        8px

        Table
        Round the container only - individual cells stay 0px to avoid fragmentation
        8px

        Avatar / Icon Button / Toggle
        Circular only when width equals height
        Full

        Navigation (nav links, tabs, menu items)
        Same as its own container's radius family - a sidebar nav link already matches Input/Button's 8px, not a separate value
        8px

      Save radius
      Reset to defaults

Nested corners only need adjusting at all when the gap between container and child is tighter than the container's own radius. In that regime, the cap is inner radius = max(0, outer radius - gap) - a ceiling on the inner element's radius, not a replacement value. The moment the gap meets or exceeds the outer radius, this formula stops applying entirely and the inner element keeps its own independent radius unchanged, full stop - it does not mean "the formula evaluates to 0, so square it." Card's 16px body padding is already wider than Card's own 12px radius, so a Button (8px) sitting inside one needs no adjustment (8px, unchanged) - not 0px, even though max(0, 12-16) alone looks like it should be. Something sitting flush against an edge with little or no gap is the case the cap is actually for - e.g. a tab strip inset only 4px inside a 12px-radius container caps at max(0, 12-4) = 8px, genuinely smaller than its own 12px default.
    
Measure the gap from the outer border edge: gap = border width + padding. A 12px outer radius, 1px border and 4px padding give a 7px child cap: 12 - (1 + 4) = 7px. The inner border contour itself is outer radius - border width. Apply the child cap per corner using its adjacent inset; when the inset exceeds the outer radius, keep the child's independent radius.

AI Rule
      
Generated interfaces must take a component's corner radius from this page's Component Defaults mapping - never invent a radius value, and never round a component that isn't listed here without first adding it to the mapping.

{}

## Radius tokens - Markdown export
    
A Markdown snapshot of your current product type and radius philosophy choices above - regenerates live as you pick, so it's always in sync. Copy it straight into your design system docs or hand it to an AI/agent workflow.

      Copy Markdown

## Implementation contract

Saved validated choices override project recommendations, which override system defaults. This implementation contract governs static specimens. Resolved tokens in the current export are authoritative values. Component exceptions must name the affected role and reason.

### Primitives and roles
Numeric --radius-n primitives retain n pixels in every philosophy. Only semantic sm/md/lg roles change: Sharp 2/4/8; Compact 2/6/12; Balanced 4/8/16; Soft 4/12/20; Expressive 8/16/32. Export these active roles and use semantic tokens for component shells.

### Permission and exceptions
Controls use sm/md according to the component recipe; panels/dialogs use md/lg. Pills use full with content width; circles require equal width/height. Attached edges and full-screen sheets set the attached corners to zero. Do not claim every third-party or native consumer is automatically tokenized.

### Nested geometry
Measure the inset between the outer contour and the child's outer contour. With border-box outer radius R, border b and padding p, an adjacent child is inset b+p: cap=max(0,R-(b+p)). For outer R=12,b=1,p=4 the cap is 7px. For the parent's inner contour use R-b and gap p. Apply independently per corner; a child separated by at least R keeps its independent radius.

### States and clipping
Hover, focus, selected and error change color/boundary but preserve corner geometry. Avoid overflow:hidden near focusable children or leave focus-ring clearance. Forced colors still expose the outline; state shape is not the only signal.

### Flow and export
Select and save the radius philosophy explicitly. Project Setup does not preselect it. Reset previews Balanced until Save foundation. Saved settings require Edit foundation before changes; Cancel retains the saved values. Export primitive/semantic mapping, attached/nested geometry, exceptions and px/rem equivalents.
Machine contract: section rules, storage, units and acceptance
{
  "schemaVersion": 1,
  "authority": "Saved validated choices override project recommendations, which override system defaults. This implementation contract governs static specimens. Resolved tokens in the current export are authoritative values. Component exceptions must name the affected role and reason.",
  "governance": {
    "owners": "Design System Lead owns token and compatibility policy. Designers own specimens and interaction contracts. Developers own resolver/export/import parity. QA and Accessibility own release evidence. Product teams own domain-specific confidence, privacy and retention policies.",
    "changes": "Change the JSON contract first, regenerate documentation/defaults/catalog/tokens, then run model, DOM and recipient checks. Link the changed finding IDs and evidence in the release review.",
    "compatibility": "Keep hue-named CSS tokens as compatibility aliases while semantic consumers migrate. Additive tokens retain schemaVersion 1. A removed/renamed key or changed stored meaning requires a schema migration, a version bump and a documented replacement before release. Keep the prior reader fixture until the migration is verified.",
    "deprecation": "Record old key, replacement, reason, introduced version, planned removal version and affected consumers. Do not remove a token while an active consumer still uses it. Future records are preserved rather than coerced.",
    "scope": "This is a web design system with one shared workspace profile. Native dp/sp adaptation and real agent execution require separate adapters and acceptance. User-defined colors and responsive exceptions require product-specific rendered verification."
  },
  "storage": {
    "version": 1,
    "legacy": "Unversioned valid records migrate in memory. Typography headingScaleVersion 2 applies the smaller six-heading scale once to older records, retaining other roles and existing font/color/style metrics. Later custom size edits are retained. Unsupported future records are preserved. The next successful write stamps the migrated version.",
    "future": "Reject unsupported future versions. Preserve raw data. Offer backup and explicit reset.",
    "invalid": "Foundation selections preview locally until Save foundation succeeds. Saved Foundation editors require Edit foundation before changes. Cancel discards the preview. Invalid drafts never replace saved records; storage failures retain the editable preview and the last durable record.",
    "concurrency": "A storage event refreshes applied tokens and disables stale editor controls until reload. Never merge simultaneous edits silently."
  },
  "units": {
    "base": "1rem = 16px at default browser settings. Do not fix the root font size.",
    "use": "Prefer rem for typography, spacing and control dimensions. Hairline borders and viewport thresholds may use px. Both equivalents appear in Markdown. SVG strokes use viewBox units. Ratios, percentages, columns, timing and weights are unitless or retain their own units.",
    "native": "Web CSS px/rem are not native dp/sp. A native adapter must map semantic roles, support text scaling and test device density. Native rendering is not shipped by this web library."
  },
  "acceptance": [
    "Compare page, applied tokens, durable record, Machine View and exported instructions.",
    "Test valid, unfinished, invalid, missing, malformed, legacy and future records. Exercise storage failure, reset, reload and another tab.",
    "Test 320, 375, 768, 1024 and 1440px widths, 200% zoom, text-spacing overrides, RTL and long/localized labels.",
    "Use keyboard and screen reader. Confirm focus return, names, values, error associations and status announcements.",
    "Verify actual rendered text/surface pairs, forced colors, reduced motion, print and exported recipes in a recipient fixture. Source or DOM checks alone are not rendered acceptance."
  ],
  "layers": {
    "content": 0,
    "sticky": 20,
    "popover": 40,
    "scrim": 60,
    "dialog": 70,
    "toast": 80,
    "tooltip": 90,
    "rules": "Each overlay gets an explicit owner and close/focus-return path. Portal menus out of clipped scroll containers. Nested dialogs stack one scrim per modal owner. Escape closes the top dismissible layer. Tooltips never block actions. Test collision and zoom; do not infer stacking order from shadow size."
  },
  "section": {
    "title": "Radius",
    "rules": {
      "Primitives and roles": "Numeric --radius-n primitives retain n pixels in every philosophy. Only semantic sm/md/lg roles change: Sharp 2/4/8; Compact 2/6/12; Balanced 4/8/16; Soft 4/12/20; Expressive 8/16/32. Export these active roles and use semantic tokens for component shells.",
      "Permission and exceptions": "Controls use sm/md according to the component recipe; panels/dialogs use md/lg. Pills use full with content width; circles require equal width/height. Attached edges and full-screen sheets set the attached corners to zero. Do not claim every third-party or native consumer is automatically tokenized.",
      "Nested geometry": "Measure the inset between the outer contour and the child's outer contour. With border-box outer radius R, border b and padding p, an adjacent child is inset b+p: cap=max(0,R-(b+p)). For outer R=12,b=1,p=4 the cap is 7px. For the parent's inner contour use R-b and gap p. Apply independently per corner; a child separated by at least R keeps its independent radius.",
      "States and clipping": "Hover, focus, selected and error change color/boundary but preserve corner geometry. Avoid overflow:hidden near focusable children or leave focus-ring clearance. Forced colors still expose the outline; state shape is not the only signal.",
      "Flow and export": "Select and save the radius philosophy explicitly. Project Setup does not preselect it. Reset previews Balanced until Save foundation. Saved settings require Edit foundation before changes; Cancel retains the saved values. Export primitive/semantic mapping, attached/nested geometry, exceptions and px/rem equivalents."
    }
  }
}

---

## Rating

Source: rating-default.html · Status: Available

Components · Forms · Rating
  Back to Rating types

# Rating
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
Use for letting someone score something on a simple 0-5 scale, like a product review or a satisfaction survey - a row of identical icon buttons that fill in as the user hovers or taps, one Rating component controlled by properties, not five one-off icons glued together.

## Properties

Icon size, label and selected count are properties of the same component, not separate icons - change them below to check this control's style and states in the Live Preview.

        Icon size

        Label

        Scale
        
          3 icons
          5 icons
          10 icons

        Selected
        
          0
          1
          2
          3
          4
          5

        Show label

          above the row

        Show numeric value

          e.g. 3/5

        Show descriptive feedback

          e.g. “Good”

        Feedback words

        Allow clear

          click selected icon to reset

        Supporting text

          shown below the row

        Supporting text

## Live Preview
    
Both icon types compared side by side, each in all 6 states. Rest, Hover and Disabled always show the icon's unrated appearance (0 filled) - Hover additionally previews the first 3 icons in a lighter tint to suggest a live hover interaction - while Selected and Focused fill in the chosen number of icons. One full matrix is rendered per selected Icon size, at the chosen Label and Selected count.

## Try it
    
A real, working Star rating - click an icon to score, hover to preview, or focus the row and use the Left/Right arrow keys (Home/End to jump to the bounds). The Heart type's interactive instance and half-star ratings aren't built here - this demonstrates the click/hover/keyboard model, which is identical for both icon types.

## When to use
    
Any place someone scores something on a simple, bounded scale, from zero up to a small fixed maximum.

      Product review
      Service feedback
      App store rating
      Satisfaction survey
      Content quality score

## Validation
    
A rating scale has no natural "empty" glyph distinct from "empty because unanswered" - for a typical 1-5 icon row with nothing clicked, zero filled icons and a required-but-missing answer look identical, so the required state has to be carried by the label and the error, not by the icons themselves.

- Required marking - put the red asterisk next to the label, same as any other required field, since the icon row itself can't show it.
      
- Validation timing - validate on submit, not on blur - there's no natural blur moment for a row of icon buttons the way there is for a text field, and validating after every hover/click would flag the field before the user has finished deciding.
      
- Error message - "Choose a rating before submitting," not "This field is required" - the message should name the action (choose a rating) instead of describing the field abstractly.
      
- Recovery - focus the first icon and keep the error visible next to the label until a value is picked - clicking any icon should clear it immediately, since a single click is a complete, valid answer.

## Component Guide

        Human View
        Machine View

Overview
      
Rating is a row of identical icon buttons (stars or hearts) that fill in as the user hovers or taps, letting someone score something on a simple, bounded scale - built for quick, low-friction feedback rather than precise numeric entry.

When to Use

- A product or service review score - a 0-5 star rating.
        
- A quick satisfaction survey question - how satisfied were you, on a small fixed scale.
        
- A content quality score - used internally to flag good or poor examples.

When Not to Use

- A precise numeric value - use Number - Rating is for a small, discrete, low-precision scale, not exact figures.
        
- A scale bigger than a handful of points - beyond roughly 5-10 points, individual icons stop being scannable at a glance; consider Slider or Number instead.
        
- A binary yes/no signal - use Switch or a simple Checkbox rather than a rating scale for a single up/down choice.

Best Practices

- Preview the would-be selection on hover before it's committed by a click/tap, so users can see what they're about to choose.
        
- Keep the icon count small and fixed (commonly 5) - a rating scale should be scannable in a single glance.
        
- Pair the icon row with a numeric or text label when precision matters (e.g. "4.5 out of 5"), since icons alone can't show fractional values clearly.

Do and Don't

Do

Rate this article

A single five-point scale for one clear question - quick to answer and quick to read back in aggregate.

Don't

Accuracy

Tone

Depth

Usefulness

Four scales turn a two-second reaction into a survey, and most people abandon it rather than score every dimension.

Accessibility

- Each icon is an independently focusable, labeled control ("Rate 3 out of 5"), not one giant unlabeled row.
        
- The current and hovered/previewed value are both announced to assistive technology, not communicated by fill color alone.
        
- Fully operable by keyboard - arrow keys move between values, Enter/Space commits the selection.

Related Components
      
Slider, Number, Badge.

{
  "component": "Rating",
  "category": "Forms",
  "summary": "Rating is a row of identical icon buttons (stars or hearts) that fill in as the user hovers or taps, letting someone score something on a simple, bounded scale - built for quick, low-friction feedback rather than precise numeric entry.",
  "whenToUse": [
    "A product or service review score - a 0-5 star rating.",
    "A quick satisfaction survey question - how satisfied were you, on a small fixed scale.",
    "A content quality score - used internally to flag good or poor examples."
  ],
  "whenNotToUse": [
    "A precise numeric value - use Number - Rating is for a small, discrete, low-precision scale, not exact figures.",
    "A scale bigger than a handful of points - beyond roughly 5-10 points, individual icons stop being scannable at a glance; consider Slider or Number instead.",
    "A binary yes/no signal - use Switch or a simple Checkbox rather than a rating scale for a single up/down choice."
  ],
  "bestPractices": [
    "Preview the would-be selection on hover before it's committed by a click/tap, so users can see what they're about to choose.",
    "Keep the icon count small and fixed (commonly 5) - a rating scale should be scannable in a single glance.",
    "Pair the icon row with a numeric or text label when precision matters (e.g. \"4.5 out of 5\"), since icons alone can't show fractional values clearly."
  ],
  "doAndDont": {
    "do": "A single five-point scale for one clear question - quick to answer and quick to read back in aggregate.",
    "dont": "Four scales turn a two-second reaction into a survey, and most people abandon it rather than score every dimension."
  },
  "accessibility": [
    "Each icon is an independently focusable, labeled control (\"Rate 3 out of 5\"), not one giant unlabeled row.",
    "The current and hovered/previewed value are both announced to assistive technology, not communicated by fill color alone.",
    "Fully operable by keyboard - arrow keys move between values, Enter/Space commits the selection."
  ],
  "relatedComponents": [
    "Slider",
    "Number",
    "Badge"
  ]
}

---

## Rating

Source: rating.html · Status: Available

Components · Forms

# Rating
  
A row of icons someone taps to score something, like a 5-star product review - filling in as the user hovers or clicks to leave a score.

## Rating type

Copy a ready-to-paste AI prompt or the working code - both use this system's own color tokens and Inter, never arbitrary values. Click the card to configure it in full.

Rate this product

Rating

          Copy prompt

---

## Result

Source: result-default.html · Status: Available

Components · Feedback · Result
  Back to Result types

# Result
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
Use for a full-panel outcome screen that reports a multi-step flow completing or failing - a large semantic icon, bold title, description and one or two action buttons, occupying the main content area - one Result component, controlled by properties, not separate panels glued together.

## Properties

Title and description are properties of the same component, not separate panels - change them below to check this result's types and states in the Live Preview.

        Title

        Heading level
        
          H1
          H2
          H3
          H4
          H5
          H6

        Description

## Live Preview
    
All 4 types compared side by side, each in all 3 states - Default, With secondary and Compact. Uses the current title and description above.

## When to use
    
The primary content of a page after a multi-step flow finishes, so the user gets a clear, prominent outcome instead of being left staring at a blank or half-updated screen.

      Checkout/payment completion
      Multi-step form submission outcome
      404 or 403 error page
      Account setup completion
      Bulk operation summary

## Component Guide

        Human View
        Machine View

Overview
      
Result is a full-panel outcome screen that reports a multi-step flow completing or failing - a large semantic icon, bold title, description, and one or two action buttons occupying the main content area, so the user gets a clear, prominent outcome instead of an ambiguous blank or half-updated screen.

When to Use

- Checkout or payment completion - a clear success screen after a purchase.
        
- The outcome of a multi-step form submission - success or failure as the flow's final screen.
        
- An error page (404/403) or a bulk operation summary - any full-page outcome, positive or negative.

When Not to Use

- A minor, in-flow confirmation that doesn't warrant a dedicated full-page screen - use Toast, Alert, or Notification instead.
        
- An intermediate step where the user still has more to do - use Steps or Progress to show partial completion, not Result, which implies an ending.
        
- A quick inline validation message - Result is for the end of a flow, not error feedback on individual fields.

Best Practices

- Make the primary next action unmistakable ("Go to dashboard", "Try again") rather than leaving the user without a clear path forward.
        
- Match the icon and tone precisely to the outcome - a success icon on a failed operation is actively confusing.
        
- Keep the description specific about what happened and, for failures, what the user can do next.

Do and Don't

Do

Payment failed
Your card was declined. Try another card.
Try again
          
Ends the flow with a clear outcome and one obvious way forward.

Don't

Payment failed
Error code 402.
          
An outcome screen with no next step strands the user at a dead end holding a code that means nothing to them.

Accessibility

- No aria-live region is added here on purpose. Result is a static post-action page occupying the main content area - like an order-confirmation screen - not a status dynamically injected into an otherwise-unchanged page the user might not be looking at. It is reached the same way any new page/view is: by a route change or full content swap, so the ordinary mechanism for that (moving focus to the page, e.g. its heading, and/or updating the document title) already tells screen-reader users the flow has ended. Wrapping it in aria-live would be redundant with, and can even fight, that page-level announcement.
        
- Because of that, the outcome (success/failure) is communicated in text, not by icon or color alone.
        
- As the primary content of the page, its heading receives focus (or is otherwise announced via the page's normal load/route-change handling) so screen-reader users immediately know the flow has ended, without relying on a live region to do that job.
        
- Action buttons use specific, descriptive labels, not generic "OK" or "Continue" with no context.

Related Components
      
Alert, Toast, Empty.

{
  "component": "Result",
  "category": "Feedback",
  "summary": "Result is a full-panel outcome screen that reports a multi-step flow completing or failing - a large semantic icon, bold title, description, and one or two action buttons occupying the main content area, so the user gets a clear, prominent outcome instead of an ambiguous blank or half-updated screen.",
  "whenToUse": [
    "Checkout or payment completion - a clear success screen after a purchase.",
    "The outcome of a multi-step form submission - success or failure as the flow's final screen.",
    "An error page (404/403) or a bulk operation summary - any full-page outcome, positive or negative."
  ],
  "whenNotToUse": [
    "A minor, in-flow confirmation that doesn't warrant a dedicated full-page screen - use Toast, Alert, or Notification instead.",
    "An intermediate step where the user still has more to do - use Steps or Progress to show partial completion, not Result, which implies an ending.",
    "A quick inline validation message - Result is for the end of a flow, not error feedback on individual fields."
  ],
  "bestPractices": [
    "Make the primary next action unmistakable (\"Go to dashboard\", \"Try again\") rather than leaving the user without a clear path forward.",
    "Match the icon and tone precisely to the outcome - a success icon on a failed operation is actively confusing.",
    "Keep the description specific about what happened and, for failures, what the user can do next."
  ],
  "doAndDont": {
    "do": "Ends the flow with a clear outcome and one obvious way forward.",
    "dont": "An outcome screen with no next step strands the user at a dead end holding a code that means nothing to them."
  },
  "accessibility": [
    "No aria-live region is added here on purpose. Result is a static post-action page occupying the main content area - like an order-confirmation screen - not a status dynamically injected into an otherwise-unchanged page the user might not be looking at. It is reached the same way any new page/view is, so the ordinary mechanism for that (moving focus to the page, e.g. its heading, and/or updating the document title) already tells screen-reader users the flow has ended; wrapping it in aria-live would be redundant with, and can even fight, that page-level announcement.",
    "Because of that, the outcome (success/failure) is communicated in text, not by icon or color alone.",
    "As the primary content of the page, its heading receives focus (or is otherwise announced via the page's normal load/route-change handling) so screen-reader users immediately know the flow has ended, without relying on a live region to do that job.",
    "Action buttons use specific, descriptive labels, not generic \"OK\" or \"Continue\" with no context."
  ],
  "relatedComponents": [
    "Alert",
    "Toast",
    "Empty"
  ]
}

---

## Result

Source: result.html · Status: Available

Components · Feedback

# Result
  
A full-panel outcome screen - a large semantic icon, a bold title, a description line and one or two action buttons - shown after a multi-step flow completes or fails (e.g. "Payment successful", "Submission failed"). Unlike Notification, a small transient card anchored to a corner, Result occupies the main content area as the page's primary content.

## Result type

Copy a ready-to-paste AI prompt or the working code - both use this system's own color tokens and Inter, never arbitrary values. Click the card to configure it in full.

Payment successful
            
Your receipt has been emailed to you.

              Done

System Control

          Copy prompt

---

## Search

Source: search-default.html · Status: Available

Components · Forms · Search
  Back to Search types

# Search
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
Use for letting people query or filter a set of content, like a table, a list, or a command palette.

## Properties

Search fields skip a visible label by convention - the placeholder and a leading icon communicate purpose. Size, corner radius, placeholder, leading icon and clear button are properties of the same component, not separate fields - change them below to check this field's style and states in the Live Preview.

        Size

        Corner radius

        Placeholder

        Leading icon

          icon on the left

        Clear button

          clears the field

        Supporting text

          shown below the field

        Supporting text

        No results message

## Live Preview
    
All 3 types compared side by side, each in all 6 states. One full matrix is rendered per selected combination of Size and Corner radius - check more than one option in a dropdown to see every combination side by side.

## When to use
    
Any field that lets someone query or filter a set of content, rather than submit a value as part of a larger form.

      Global search
      Table filter
      Command palette
      Autocomplete lookup
      Inbox search

## Validation
    
Search is usually a standalone query field, not a required part of a form, so its validation is less about "did you fill this in" and more about handling the async states between typing and results.

- Loading state - show a subtle spinner in or near the field while results are being fetched, rather than freezing the list or leaving it blank with no signal that a query is in flight.
      
- No-results state - when a query genuinely matches nothing, say so specifically, e.g. "No results for 'invioce'" - and suggest checking spelling or broadening the query, rather than leaving an empty list with no explanation.
      
- Fetch failure - a network or server error is not the same as zero results - show a distinct message, e.g. "We couldn't load search results - try again," so the user knows to retry rather than assume the query matched nothing.
      
- Required marking - only relevant when Search doubles as a required filter field inside a form (uncommon) - in that case, mark and validate it the same as any required Input, on submit rather than on every keystroke.

## Component Guide

        Human View
        Machine View

Overview
      
Search is a text field purpose-built for querying or filtering a set of content - it intentionally skips a visible label by convention, since a search icon and placeholder text make its purpose obvious in the contexts it's used.

When to Use

- Global or site-wide search - a top-level search bar.
        
- Filtering a table, list, or dataset already on screen - narrowing visible rows as the user types.
        
- A command palette or inbox search - any live-filtering query field.

When Not to Use

- A value submitted as part of a larger form - use Input - Search implies live querying, not form submission.
        
- A field that needs a visible, persistent label for clarity (e.g. in a dense settings form) - use Input with a label instead of relying on the search icon alone.
        
- A field that should suggest specific matching values as you type - use Autocomplete if suggestions, not just filtering, are the goal.

Best Practices

- Debounce the query as the user types rather than searching on every keystroke, especially for server-side search.
        
- Always include a visible clear ('x') control once text has been entered.
        
- Show a clear empty-results state when a query returns nothing, rather than leaving a blank list.

Do and Don't

Do

×
Searches file names and contents.
          
Says what is being searched, and offers a clear affordance so the user can get back to the unfiltered list in one action.

Don't

With no scope stated and no way to clear, an empty result set is unreadable - the user cannot tell whether nothing matched or they searched the wrong thing.

Accessibility

- Even without a visible label, the field carries an accessible name (via aria-label or a visually hidden label) so screen readers announce its purpose.
        
- The clear button is independently focusable and labeled ("Clear search"), not just an icon with no accessible name.
        
- Live-updating results are announced via an aria-live region so screen-reader users know the list changed.

Related Components
      
Input, Autocomplete, Table, List.

{
  "component": "Search",
  "category": "Forms",
  "summary": "Search is a text field purpose-built for querying or filtering a set of content - it intentionally skips a visible label by convention, since a search icon and placeholder text make its purpose obvious in the contexts it's used.",
  "whenToUse": [
    "Global or site-wide search - a top-level search bar.",
    "Filtering a table, list, or dataset already on screen - narrowing visible rows as the user types.",
    "A command palette or inbox search - any live-filtering query field."
  ],
  "whenNotToUse": [
    "A value submitted as part of a larger form - use Input - Search implies live querying, not form submission.",
    "A field that needs a visible, persistent label for clarity (e.g. in a dense settings form) - use Input with a label instead of relying on the search icon alone.",
    "A field that should suggest specific matching values as you type - use Autocomplete if suggestions, not just filtering, are the goal."
  ],
  "bestPractices": [
    "Debounce the query as the user types rather than searching on every keystroke, especially for server-side search.",
    "Always include a visible clear ('x') control once text has been entered.",
    "Show a clear empty-results state when a query returns nothing, rather than leaving a blank list."
  ],
  "doAndDont": {
    "do": "Says what is being searched, and offers a clear affordance so the user can get back to the unfiltered list in one action.",
    "dont": "With no scope stated and no way to clear, an empty result set is unreadable - the user cannot tell whether nothing matched or they searched the wrong thing."
  },
  "accessibility": [
    "Even without a visible label, the field carries an accessible name (via aria-label or a visually hidden label) so screen readers announce its purpose.",
    "The clear button is independently focusable and labeled (\"Clear search\"), not just an icon with no accessible name.",
    "Live-updating results are announced via an aria-live region so screen-reader users know the list changed."
  ],
  "relatedComponents": [
    "Input",
    "Autocomplete",
    "Table",
    "List"
  ]
}

---

## Search

Source: search.html · Status: Available

Components · Forms

# Search
  
A single-line field for querying or filtering content, with a leading search icon and a trailing clear button that appears once text is entered.

## Search type

Copy a ready-to-paste AI prompt or the working code - both use this system's own color tokens and Inter, never arbitrary values. Click the card to configure it in full.

Search Field

          Copy prompt

---

## Select

Source: select-dropdown.html · Status: Available

Components · Forms · Select
  Back to Select types

# Select
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
Use for choosing one value from a fixed list, like a country, a status, or a sort order - a picker, not a free-form text field.

## Properties

Size, corner radius, label and placeholder are properties of the same component, not separate fields - change them below to check this field's style and states in the Live Preview.

        Size

        Corner radius

        Label

        Placeholder

        Allow clear

          × replaces chevron once filled

        Options
        Canada
France
Japan
Kenya

        Default selected value

        Required

          shows a required indicator

        Supporting text

          shown below the field

        Supporting text

        Error message

## Live Preview
    
All 4 types compared side by side, each in all 8 states - including Open, which shows the actual options panel, and Loading. One full matrix is rendered per selected combination of Size and Corner radius - check more than one option in a dropdown to see every combination side by side.

## Try it
    
The comparison matrix above freezes one state per row to demonstrate each side by side. This instance is real: click to open it, type to filter the options, and pick one.

        Search

          filter options while typing

        Search placeholder

## When to use
    
Any form field that picks one value from a known, fixed set of options - never for free-form text.

      Country
      State/Province
      Sort order
      Category
      Language

## Validation
    
A required Select with nothing chosen is still showing its placeholder, not an error - treat "no selection" as invalid only once the user has had a chance to choose.

- Required marking - place an asterisk next to the label, using the Foundation danger color and a programmatic required state. Explain its meaning once per form; omit optional suffixes.
      
- Validation timing - flag a missing required value on blur or submit, not the instant the trigger receives focus - opening the panel to look at options isn't itself an error.
      
- Error message - name what's missing, "Choose a country to continue," rather than a generic "This field is required."

## Component Guide

        Human View
        Machine View

Overview
      
Select is a trigger field that opens a panel of predefined options, letting the user pick exactly one value from a known, fixed set - visually similar to Input but read-only and paired with a chevron, distinct from Dropdown (which triggers actions, not a form value) and Cascader (multi-level drill-down).

When to Use

- A value from a known, fixed set - country, state/province, category.
        
- Sort order or similar single-choice configuration - Newest first, Price low to high.
        
- A language or locale picker - any small-to-medium closed option list.

When Not to Use

- Free-form text with no fixed set of valid values - use Input.
        
- Hierarchical or nested data - use Cascader (linked columns) or Tree Select (an expandable tree).
        
- Selecting more than one value at a time - use a multi-select variant, Checkbox group, or Transfer.
        
- A very large option list better filtered by typing - use Autocomplete instead of scrolling a long panel.

Best Practices

- Order options logically - alphabetical, by frequency of use, or with a sensible default first.
        
- Show an explicit placeholder like "Select an option" rather than silently pre-selecting an arbitrary value.
        
- Truncate long option labels gracefully in the closed trigger rather than letting them overflow the field.

Do and Don't

Do

Country
Select a country
          
An explicit placeholder makes it obvious nothing has been chosen yet, so an untouched field cannot be mistaken for a decision.

Don't

Country
Afghanistan
          
Pre-selecting the alphabetically-first option silently submits an answer nobody gave.

Accessibility

- The trigger uses role="combobox" with aria-haspopup/aria-expanded, and the Open state shows a real role="listbox" panel with role="option" items and aria-selected on the current value - the roles a screen reader needs to announce this as a real picker, not a styled div.
        
- Keyboard focus stays on the trigger when closed and moves into the option list when open.
        
- A visible label is associated with the control, and the currently selected value is announced.

Related Components
      
Input, Cascader, Tree Select, Autocomplete, Dropdown.

{
  "component": "Select",
  "type": "Dropdown",
  "category": "Forms",
  "summary": "Select is a trigger field that opens a panel of predefined options, letting the user pick exactly one value from a known, fixed set - visually similar to Input but read-only and paired with a chevron, distinct from Dropdown (which triggers actions, not a form value) and Cascader (multi-level drill-down).",
  "whenToUse": [
    "A value from a known, fixed set - country, state/province, category.",
    "Sort order or similar single-choice configuration - Newest first, Price low to high.",
    "A language or locale picker - any small-to-medium closed option list."
  ],
  "whenNotToUse": [
    "Free-form text with no fixed set of valid values - use Input.",
    "Hierarchical or nested data - use Cascader (linked columns) or Tree Select (an expandable tree).",
    "Selecting more than one value at a time - use a multi-select variant, Checkbox group, or Transfer.",
    "A very large option list better filtered by typing - use Autocomplete instead of scrolling a long panel."
  ],
  "bestPractices": [
    "Order options logically - alphabetical, by frequency of use, or with a sensible default first.",
    "Show an explicit placeholder like \"Select an option\" rather than silently pre-selecting an arbitrary value.",
    "Truncate long option labels gracefully in the closed trigger rather than letting them overflow the field."
  ],
  "doAndDont": {
    "do": "An explicit placeholder makes it obvious nothing has been chosen yet, so an untouched field cannot be mistaken for a decision.",
    "dont": "Pre-selecting the alphabetically-first option silently submits an answer nobody gave."
  },
  "accessibility": [
    "The trigger uses role=\"combobox\" with aria-haspopup/aria-expanded, and the Open state shows a real role=\"listbox\" panel with role=\"option\" items and aria-selected on the current value - the roles a screen reader needs to announce this as a real picker, not a styled div.",
    "Keyboard focus stays on the trigger when closed and moves into the option list when open.",
    "A visible label is associated with the control, and the currently selected value is announced."
  ],
  "relatedComponents": [
    "Input",
    "Cascader",
    "Tree Select",
    "Autocomplete",
    "Dropdown"
  ]
}

---

## Select

Source: select.html · Status: Available

Components · Forms

# Select
  
A form control for choosing one value from a fixed list - visually similar to a text input but with a fixed trailing chevron-down icon and no visible text cursor, since it's a picker, not editable text.

## Select type

Copy a ready-to-paste AI prompt or the working code - both use this system's own color tokens and Inter, never arbitrary values. Click the card to configure it in full.

            Country

              Select a country

Dropdown

          Copy prompt

---

## Shadows

Source: shadows.html · Status: Available

Foundations · Shadows

# Shadows
  
Shadow is an elevation system, not decoration - it answers one question: how far above the surrounding surface does this sit? Use the smallest elevation that communicates the right layer, and never rely on shadow alone for focus, selection or state.

## Shadow philosophy

        Human View
        Machine View

The elevation character every card, dropdown, panel and overlay in this system follows. Balanced is the global default unless your product type above recommends otherwise.

          Flat

Little or no shadow - separation comes from borders, surface color and spacing instead. Best for: Enterprise / Data-heavy / Financial / Technical products.
        
None, XS

          Subtle

Very restrained elevation for clean, professional interfaces. Best for: Enterprise SaaS / B2B / Dashboards / Productivity tools.
        
None, XS, SM, MD, LG

          Balanced
          Recommended

A controlled elevation hierarchy that works across most products. Best for: SaaS / Web / Mobile / Cross-platform / AI products.
        
None, XS, SM, MD, LG, XL

          Soft

Diffused shadows with larger blur and lower opacity. Best for: Consumer / Mobile / Lifestyle / Healthcare / Customer-facing products.
        
None, SM, MD, LG, XL, 2XL

          Expressive

Dramatic elevation and depth for brand-forward experiences. Best for: Marketing / Creative / Consumer brands / Experimental interfaces.
        
None, SM, MD, LG, XL, 2XL

{}

## Elevation hierarchy

        Human View
        Machine View

Semantic elevation layers, not arbitrary box-shadow values - each answers "how far above the surface does this sit?"

        Base
        Page, section, table rows - same surface, no elevation needed
        None

        Raised
        Standard cards, slightly raised controls, sticky elements
        XS · SM

        Dropdown / Popover
        Clearly elevated above the content beneath - menus, date pickers
        MD

        Floating / Drawer
        Floating panels, toolbars, side drawers
        LG

        Modal
        Dialogs and modals - pair with a backdrop and surface contrast, not shadow alone
        XL

        Major overlay
        Complex overlays and large floating experiences - use sparingly
        2XL

{}

## Component defaults

        Human View
        Machine View

        Button
        Default none · hover XS · pressed none - don't make every button look elevated
        None / XS

        Input
        Default none · focus uses a visible ring, never shadow alone
        None

        Card (static)
        A bordered display-only card uses no shadow. An explicitly elevated surface can use SM; neither changes on hover because it has no action.
        None / optional SM

        Card (interactive)
        A real <a>/<button> (or explicitly marked --interactive) - the whole card is one click target, so its elevation should say so: default SM → hover MD → pressed XS
        SM → MD → XS

        Dropdown / Popover
        Should clearly appear above the content beneath it
        MD

        Tooltip
        Stays visually lightweight - never heavier than a card
        SM

        Modal / Dialog
        Pair with backdrop + surface contrast, not shadow alone
        XL

        Drawer / Bottom sheet
        Side drawer LG · mobile bottom sheet XL - edge touching the viewport stays unrounded, not unshadowed
        LG / XL

        Floating action button
        Default MD · hover LG · pressed SM
        SM / MD / LG

        Sticky header
        None until scrolled, then XS - never a permanent strong shadow
        None / XS

        Table
        Borders and row separation do the work - avoid shadows between rows
        None

        Navigation (sidebar, topbar)
        A border does the separating (this shell's own sidebar/topbar use a border, not a shadow) - reach for Sticky header's rule only once nav starts overlapping scrolling content
        None

      Save shadow system
      Reset to defaults

{}

## Shadows and interaction states
    
"Never shadow alone" needs a concrete second signal per state, not just the principle - here's what this system actually uses for each, with the real rule behind it:

        Focus
        A visible outline/ring, never elevation - confirmed: every real input's focus state uses outline: 2px solid var(--color-focus-ring), not a box-shadow change
        Outline

        Selected
        Border color change, plus a solid (not blurred) box-shadow ring used as an outline substitute, not elevation - confirmed: Card's own .is-selected pairs border-color with box-shadow: 0 0 0 1px, a flat ring, not a soft elevation shadow
        Border + solid ring

        Pressed
        Background color change on :active, confirmed across every real Button type - :active fires reliably on touch (press-and-hold), unlike :hover, which doesn't fire at all on most touch devices and shouldn't be the only pressed cue
        Background

Reduced motion is already handled sitewide, not per-shadow: a global @media (prefers-reduced-motion: reduce) rule collapses every transition and animation duration to near-zero - a shadow's own hover/press transition inherits this automatically, no separate opt-out needed per component.
    
Performance: a box-shadow transition repaints the shadow itself every frame - it isn't compositor-accelerated the way transform/opacity are. Keep shadow transitions short and triggered only by a real state change (hover, press, a panel opening) - never continuous, looping or scroll-linked, which is where an animated box-shadow's real cost shows up.

## Shadow tokens - Markdown export
    
Copy the shadow guidance and current applied philosophy, including px and rem recipes. The export updates when settings change.

      Copy Markdown

## Implementation contract

Saved validated choices override project recommendations, which override system defaults. This implementation contract governs static specimens. Resolved tokens in the current export are authoritative values. Component exceptions must name the affected role and reason.

### Philosophy algorithm
Flat removes all shadows. Subtle/Balanced/Soft/Expressive multiply y-offset and blur by 0.5/1/1.4/2 while retaining recipe opacity. xs through 2xl use y/blur/alpha: 1/2/.06,1/4/.08,4/8/.10,8/16/.12,12/24/.14,16/32/.16. Export resolved offsets, blur, spread, color and inset rather than just philosophy names.

### Card variants
Static bordered cards use no shadow. Explicitly elevated static cards use SM with no hover change. Interactive cards use SM at rest, MD on hover and XS when pressed. Focus uses an outline. Flat philosophy removes these shadows while borders/surfaces retain separation.

### Modes and alternatives
Dark surfaces and custom palettes must be checked for actual layer separation. Use surface and boundary tokens when shadow is invisible. Forced colors and print preserve boundaries and remove decorative shadow. Do not make a shadow the only sign of a control or modal.

### Layers
Use the shared layer map: content 0, sticky 20, popover 40, scrim 60, dialog 70, toast 80, tooltip 90. Portal overlays out of clipped containers, assign focus ownership, close the top layer with Escape, restore trigger focus and test nested owners/collisions. Elevation magnitude is not z-index.

### Motion and export
Apply hover/pressed effects only to actionable cards. Reduced motion removes animated elevation; touch has no hover requirement. Export both theme recipes, philosophy mapping, card variants, layer map, focus/clip rules and px/rem equivalents.

### Save and edit
Selections preview immediately. Save foundation commits valid settings in this browser and locks the editor. Select Edit foundation to revise saved settings; Cancel retains the saved settings. Storage failure keeps the draft editable.
Machine contract: section rules, storage, units and acceptance
{
  "schemaVersion": 1,
  "authority": "Saved validated choices override project recommendations, which override system defaults. This implementation contract governs static specimens. Resolved tokens in the current export are authoritative values. Component exceptions must name the affected role and reason.",
  "governance": {
    "owners": "Design System Lead owns token and compatibility policy. Designers own specimens and interaction contracts. Developers own resolver/export/import parity. QA and Accessibility own release evidence. Product teams own domain-specific confidence, privacy and retention policies.",
    "changes": "Change the JSON contract first, regenerate documentation/defaults/catalog/tokens, then run model, DOM and recipient checks. Link the changed finding IDs and evidence in the release review.",
    "compatibility": "Keep hue-named CSS tokens as compatibility aliases while semantic consumers migrate. Additive tokens retain schemaVersion 1. A removed/renamed key or changed stored meaning requires a schema migration, a version bump and a documented replacement before release. Keep the prior reader fixture until the migration is verified.",
    "deprecation": "Record old key, replacement, reason, introduced version, planned removal version and affected consumers. Do not remove a token while an active consumer still uses it. Future records are preserved rather than coerced.",
    "scope": "This is a web design system with one shared workspace profile. Native dp/sp adaptation and real agent execution require separate adapters and acceptance. User-defined colors and responsive exceptions require product-specific rendered verification."
  },
  "storage": {
    "version": 1,
    "legacy": "Unversioned valid records migrate in memory. Typography headingScaleVersion 2 applies the smaller six-heading scale once to older records, retaining other roles and existing font/color/style metrics. Later custom size edits are retained. Unsupported future records are preserved. The next successful write stamps the migrated version.",
    "future": "Reject unsupported future versions. Preserve raw data. Offer backup and explicit reset.",
    "invalid": "Foundation selections preview locally until Save foundation succeeds. Saved Foundation editors require Edit foundation before changes. Cancel discards the preview. Invalid drafts never replace saved records; storage failures retain the editable preview and the last durable record.",
    "concurrency": "A storage event refreshes applied tokens and disables stale editor controls until reload. Never merge simultaneous edits silently."
  },
  "units": {
    "base": "1rem = 16px at default browser settings. Do not fix the root font size.",
    "use": "Prefer rem for typography, spacing and control dimensions. Hairline borders and viewport thresholds may use px. Both equivalents appear in Markdown. SVG strokes use viewBox units. Ratios, percentages, columns, timing and weights are unitless or retain their own units.",
    "native": "Web CSS px/rem are not native dp/sp. A native adapter must map semantic roles, support text scaling and test device density. Native rendering is not shipped by this web library."
  },
  "acceptance": [
    "Compare page, applied tokens, durable record, Machine View and exported instructions.",
    "Test valid, unfinished, invalid, missing, malformed, legacy and future records. Exercise storage failure, reset, reload and another tab.",
    "Test 320, 375, 768, 1024 and 1440px widths, 200% zoom, text-spacing overrides, RTL and long/localized labels.",
    "Use keyboard and screen reader. Confirm focus return, names, values, error associations and status announcements.",
    "Verify actual rendered text/surface pairs, forced colors, reduced motion, print and exported recipes in a recipient fixture. Source or DOM checks alone are not rendered acceptance."
  ],
  "layers": {
    "content": 0,
    "sticky": 20,
    "popover": 40,
    "scrim": 60,
    "dialog": 70,
    "toast": 80,
    "tooltip": 90,
    "rules": "Each overlay gets an explicit owner and close/focus-return path. Portal menus out of clipped scroll containers. Nested dialogs stack one scrim per modal owner. Escape closes the top dismissible layer. Tooltips never block actions. Test collision and zoom; do not infer stacking order from shadow size."
  },
  "section": {
    "title": "Shadows",
    "rules": {
      "Philosophy algorithm": "Flat removes all shadows. Subtle/Balanced/Soft/Expressive multiply y-offset and blur by 0.5/1/1.4/2 while retaining recipe opacity. xs through 2xl use y/blur/alpha: 1/2/.06,1/4/.08,4/8/.10,8/16/.12,12/24/.14,16/32/.16. Export resolved offsets, blur, spread, color and inset rather than just philosophy names.",
      "Card variants": "Static bordered cards use no shadow. Explicitly elevated static cards use SM with no hover change. Interactive cards use SM at rest, MD on hover and XS when pressed. Focus uses an outline. Flat philosophy removes these shadows while borders/surfaces retain separation.",
      "Modes and alternatives": "Dark surfaces and custom palettes must be checked for actual layer separation. Use surface and boundary tokens when shadow is invisible. Forced colors and print preserve boundaries and remove decorative shadow. Do not make a shadow the only sign of a control or modal.",
      "Layers": "Use the shared layer map: content 0, sticky 20, popover 40, scrim 60, dialog 70, toast 80, tooltip 90. Portal overlays out of clipped containers, assign focus ownership, close the top layer with Escape, restore trigger focus and test nested owners/collisions. Elevation magnitude is not z-index.",
      "Motion and export": "Apply hover/pressed effects only to actionable cards. Reduced motion removes animated elevation; touch has no hover requirement. Export both theme recipes, philosophy mapping, card variants, layer map, focus/clip rules and px/rem equivalents.",
      "Save and edit": "Selections preview immediately. Save foundation commits valid settings in this browser and locks the editor. Select Edit foundation to revise saved settings; Cancel retains the saved settings. Storage failure keeps the draft editable."
    }
  }
}

---

## Skeleton

Source: skeleton-default.html · Status: Available

Components · Feedback · Skeleton
  Back to Skeleton types

# Skeleton
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
Use for standing in for content that has not finished loading yet - stacked text lines, an avatar with text, or a card - so the layout does not jump once the real content arrives, and the wait feels shorter than a blank screen or spinner.

## Properties

Rows is a property of the same component, not a separate skeleton - change it below to check every layout and state in the Live Preview. Avatar + text always shows a fixed 2 lines regardless of Rows, since it represents a single list-item/comment shape rather than a variable block of text.

        Rows

## Live Preview
    
All 3 layouts compared side by side, each in both states - Animated plays the shimmer sweep, Reduced motion shows the exact same shapes with no animation, for users who prefer reduced motion.

## When to use
    
Any time content is still being fetched and a shape-matched placeholder would reduce perceived loading time better than a blank area or a generic spinner.

      Initial page/data load
      Infinite scroll list loading
      Async card or feed content
      Profile/avatar loading state
      Dashboard widget loading

## Component Guide

        Human View
        Machine View

Overview
      
Skeleton stands in for content that hasn't finished loading yet - stacked text lines, an avatar with text, or a card-shaped placeholder - so the layout doesn't jump once real content arrives, and the wait feels shorter than a blank screen or a generic spinner.

When to Use

- Initial page or data load - showing the eventual layout's shape before content arrives.
        
- Infinite scroll or async feed content - placeholders for rows or cards not yet loaded.
        
- Profile/avatar loading or dashboard widgets - any content whose eventual shape is known in advance.

When Not to Use

- A loading state with no predictable content shape - use Spin - Skeleton relies on knowing roughly what will appear.
        
- A brief, sub-second load - a flash of skeleton UI can feel more distracting than a near-instant content swap; reserve it for loads long enough to actually help.
        
- An operation with a known percentage of completion - use Progress, which communicates real completion, not just "still loading."

Best Practices

- Match the skeleton's shape closely to the real content's eventual layout, so the transition feels seamless rather than jarring.
        
- Use a subtle shimmer or pulse animation to signal "still loading" rather than a static gray block that could be mistaken for an error.
        
- Swap it out the moment real content is ready - don't hold it past the actual load time.

Do and Don't

Do

Placeholders shaped like the content that is coming, so nothing jumps when it arrives.

Don't

A single generic bar that looks nothing like the eventual layout gives no hint of what is loading, and the page still lurches when it lands.

Accessibility

- The containing placeholder carries aria-busy="true" and aria-live="polite" (shown on the demo markup above), not just visual shimmer - silence during load reads as broken to a screen-reader user, who gets no equivalent of seeing shapes animate on screen.
        
- Once real content replaces it, the same live region's contents are swapped for the real DOM, so its arrival is announced too, and aria-busy is cleared to false.
        
- Purely decorative beyond that announcement - it never receives keyboard focus itself.

Related Components
      
Spin, Progress, Empty.

{
  "component": "Skeleton",
  "category": "Feedback",
  "summary": "Skeleton stands in for content that hasn't finished loading yet - stacked text lines, an avatar with text, or a card-shaped placeholder - so the layout doesn't jump once real content arrives, and the wait feels shorter than a blank screen or a generic spinner.",
  "whenToUse": [
    "Initial page or data load - showing the eventual layout's shape before content arrives.",
    "Infinite scroll or async feed content - placeholders for rows or cards not yet loaded.",
    "Profile/avatar loading or dashboard widgets - any content whose eventual shape is known in advance."
  ],
  "whenNotToUse": [
    "A loading state with no predictable content shape - use Spin - Skeleton relies on knowing roughly what will appear.",
    "A brief, sub-second load - a flash of skeleton UI can feel more distracting than a near-instant content swap; reserve it for loads long enough to actually help.",
    "An operation with a known percentage of completion - use Progress, which communicates real completion, not just \"still loading.\""
  ],
  "bestPractices": [
    "Match the skeleton's shape closely to the real content's eventual layout, so the transition feels seamless rather than jarring.",
    "Use a subtle shimmer or pulse animation to signal \"still loading\" rather than a static gray block that could be mistaken for an error.",
    "Swap it out the moment real content is ready - don't hold it past the actual load time."
  ],
  "doAndDont": {
    "do": "Placeholders shaped like the content that is coming, so nothing jumps when it arrives.",
    "dont": "A single generic bar that looks nothing like the eventual layout gives no hint of what is loading, and the page still lurches when it lands."
  },
  "accessibility": [
    "The containing placeholder carries aria-busy=\"true\" and aria-live=\"polite\", not just visual shimmer - silence during load reads as broken to a screen-reader user, who gets no equivalent of seeing shapes animate on screen.",
    "Once real content replaces it, the same live region's contents are swapped for the real DOM, so its arrival is announced too, and aria-busy is cleared to false.",
    "Purely decorative beyond that announcement - it never receives keyboard focus itself."
  ],
  "relatedComponents": [
    "Spin",
    "Progress",
    "Empty"
  ]
}

---

## Skeleton

Source: skeleton.html · Status: Available

Components · Feedback

# Skeleton
  
A shimmering placeholder made of pulsing gray blocks that mirror the shape of content still loading - stacked text lines, an avatar circle next to text lines, or a card with a media block and caption lines - shown while real content is being fetched, to reduce perceived loading time and avoid layout jank.

## Skeleton type

Copy a ready-to-paste AI prompt or the working code - both use this system's own color tokens and Inter, never arbitrary values. Click the card to configure it in full.

System Control

          Copy prompt

---

## Slider

Source: slider-default.html · Status: Available

Components · Forms · Slider
  Back to Slider types

# Slider
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
Use for picking a numeric value, or a range of two values, by dragging a thumb along a track, like a volume level or a price range filter - one Slider component, controlled by properties, not a raw browser range input styled on its own.

## Properties

Track thickness, label text and value are properties of the same component, not separate sliders - change them below to check both types and every state in the Live Preview. There is no configurable corner radius: the track and thumb are always a full pill shape, since a slider control has no practical use for sharp or partial corners.

        Track thickness

        Label text

        Value

        Minimum

        Maximum

        Step

        Show label

          above the track

        Show value

          beside the label

        Value prefix

        Value suffix

        Thumb shape
        
          Circle
          Rounded square

        Tick marks

          one per step interval

        Supporting text

          shown below the track

        Supporting text

## Live Preview
    
Both types compared side by side, each in all 4 states - Disabled applies to the whole control, and Focused shows a focus ring on the thumb rather than the track. One full matrix is rendered per selected Track thickness, at the chosen Label and Value.

## Try it
    
A real, working Single slider - drag the thumb, click anywhere on the track, or focus it and use the Left/Right/Up/Down arrow keys (or Home/End to jump to the bounds). Respects the configured Min, Max, Step, prefix/suffix and tick marks above. The Range type's two-thumb drag interaction (including crossing behavior) is a separate, larger feature and isn't built here - the Live Preview above still shows its static appearance.

## When to use
    
Any control where a user picks a numeric value, or a range of two values, along a continuous scale.

      Volume control
      Price range filter
      Brightness
      Zoom level
      Progress scrubber

## Validation
    
Dragging a thumb can't produce an out-of-range value - the track itself constrains the position - so validation only matters for the paired numeric input some Slider variants offer for typing an exact value.

- Range validation - validate the typed value against the slider's min and max on blur, e.g. typing "150" on a 0-100 slider, and either clamp it to the nearest bound or reject it.
      
- Error message - state the actual bounds, e.g. "Enter a value between 0 and 100," rather than a generic "Invalid value."
      
- Step validation - if the slider only allows fixed increments, snap a typed in-between value to the nearest valid step rather than accepting it as entered.
      
- Required marking - a slider always shows some numeric position, so it usually can't represent "no answer" the way a text field can - only mark it required if this variant explicitly supports a distinct unset state; otherwise there's nothing meaningful to validate as "empty."

## Component Guide

        Human View
        Machine View

Overview
      
Slider lets someone pick a numeric value, or a range of two values, by dragging a thumb along a track - used for continuous or coarse-grained values where the exact number matters less than quickly finding the right position, like a volume level or a price filter.

When to Use

- A value picked along a continuous scale - volume, brightness, zoom level.
        
- A bounded range of two values - a price range filter with a low and high thumb.
        
- A scrubber for position within a duration - a progress scrubber.

When Not to Use

- A value that needs precise, exact keyboard entry - use Number instead - dragging is imprecise for exact values like "37".
        
- A choice from a small set of discrete, named options - use Group Button, Radio, or Select rather than a slider with only a few valid stops.
        
- A single date or time value - use Date Picker or Time - a slider doesn't communicate calendar or clock context.

Best Practices

- Show the current value as text alongside the track, since position alone is hard to read precisely.
        
- Choose a track thickness and thumb size that stay comfortably draggable on touch as well as with a mouse.
        
- Support arrow-key adjustment in fixed increments as an alternative to dragging.

Do and Don't

Do

Opacity - 60%

An approximate setting the user judges by eye, with the current value shown so the choice is still repeatable.

Don't

Invoice amount

A slider cannot hit an exact figure, and no value is shown to confirm one. Anything that must be precise belongs in a Number field.

Accessibility

- Exposed with proper slider role semantics, including the current value, minimum, and maximum, all announced to assistive technology.
        
- Fully operable by keyboard - arrow keys adjust the value, Home/End jump to the bounds.
        
- The focus ring appears on the thumb itself, independent of any hover-only styling.

Related Components
      
Number, Rating, Progress.

{
  "component": "Slider",
  "category": "Forms",
  "summary": "Slider lets someone pick a numeric value, or a range of two values, by dragging a thumb along a track - used for continuous or coarse-grained values where the exact number matters less than quickly finding the right position, like a volume level or a price filter.",
  "whenToUse": [
    "A value picked along a continuous scale - volume, brightness, zoom level.",
    "A bounded range of two values - a price range filter with a low and high thumb.",
    "A scrubber for position within a duration - a progress scrubber."
  ],
  "whenNotToUse": [
    "A value that needs precise, exact keyboard entry - use Number instead - dragging is imprecise for exact values like \"37\".",
    "A choice from a small set of discrete, named options - use Group Button, Radio, or Select rather than a slider with only a few valid stops.",
    "A single date or time value - use Date Picker or Time - a slider doesn't communicate calendar or clock context."
  ],
  "bestPractices": [
    "Show the current value as text alongside the track, since position alone is hard to read precisely.",
    "Choose a track thickness and thumb size that stay comfortably draggable on touch as well as with a mouse.",
    "Support arrow-key adjustment in fixed increments as an alternative to dragging."
  ],
  "doAndDont": {
    "do": "An approximate setting the user judges by eye, with the current value shown so the choice is still repeatable.",
    "dont": "A slider cannot hit an exact figure, and no value is shown to confirm one. Anything that must be precise belongs in a Number field."
  },
  "accessibility": [
    "Exposed with proper slider role semantics, including the current value, minimum, and maximum, all announced to assistive technology.",
    "Fully operable by keyboard - arrow keys adjust the value, Home/End jump to the bounds.",
    "The focus ring appears on the thumb itself, independent of any hover-only styling."
  ],
  "relatedComponents": [
    "Number",
    "Rating",
    "Progress"
  ]
}

---

## Slider

Source: slider.html · Status: Available

Components · Forms

# Slider
  
A draggable control for picking a numeric value, or a range of two values, along a track, like a volume level or a price range filter.

## Slider type

Copy a ready-to-paste AI prompt or the working code - both use this system's own color tokens and Inter, never arbitrary values. Click the card to configure it in full.

Volume

System Control

          Copy prompt

---

## Spacing

Source: spacing.html · Status: Available

Foundations · Spacing

# Spacing
  
The spacing scale and rhythm every layout, component and page in this system is built from.

## What are you building?

        Human View
        Machine View

Pick the product type closest to yours and the recommended spacing system below updates to match - you can still choose a different one manually afterward.

        SaaS
        4px primary · 8px secondary

        Enterprise SaaS
        4px primary · 2px secondary

        Web Application
        4px primary · 8px secondary

        Desktop Web (D-Web)
        8px primary · 4px secondary

        Mobile Web (M-Web)
        4px primary · 8px secondary

        Mobile Application
        4px primary · 8px secondary

        Marketing Website
        8px primary · 4px secondary

        Dashboard
        4px primary · 8px secondary

        Data-Heavy Application
        2px primary · 4px secondary

        Consumer App
        4px primary · 8px secondary

        AI Product
        4px primary · 8px secondary

        Cross-Platform
        4px primary · 2px + 8px secondary

Recommended

{}

## Spacing system

        Human View
        Machine View

The base unit every spacing token in this system derives from. 4px Balanced is the global default unless your product type above recommends otherwise.

          2px
          Precision

Best for dense enterprise interfaces, data-heavy dashboards and fine micro-adjustments.
        
2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 28, 32, 40, 48, 56, 64, 80, 96, 128

          4px
          Balanced
          Recommended

Best for SaaS, responsive applications, mobile, web and cross-platform systems.
        
4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 56, 64, 72, 80, 96, 112, 128

          8px
          Structured

Best for desktop-first products, marketing sites and spacious layouts.
        
8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 128

          Adaptive
          Recommended for advanced teams

Combines 2px precision, 4px component and 8px structural spacing automatically by context.
        
2 · 4 · 6 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128

{}

## Recommended global model

        Human View
        Machine View

The strongest systems don't force a single unit - they combine three, each doing a different job.

Precision
2px

Base / Standard
4px

Structural
8px

        Micro spacing
        Icon-to-text, badge internals, compact controls, fine alignment
        2, 4, 6, 8px

        Component spacing
        Button/input padding, card content, form fields, label-to-input
        8, 12, 16, 20, 24, 32px

        Layout spacing
        Sections, containers, page-level spacing, major content blocks
        24, 32, 40, 48, 64, 80, 96, 128px

      Save spacing
      Reset to defaults

AI Rule
      
Generated interfaces must use a value from this page's Micro / Component / Layout scale for every margin, padding and gap - never an arbitrary pixel value, and never a value interpolated between two scale steps to arrive at a novel spacing. One documented exception: a container's own outer padding (a page shell, a setup panel - not a component's internal spacing) may use clamp(a, Nvw, b) where both a and b are themselves real scale steps, letting that one padding breathe between two approved values across viewport widths instead of jumping between them at a breakpoint - this system's own Project setup panel does exactly this (clamp(20px, 3vw, 32px), both ends on the Balanced scale). Logical properties (margin-inline-end, not margin-right) are required wherever spacing differs by writing direction, so RTL doesn't need a separate rule restated per component.

{}

## Component defaults

        Human View
        Machine View

Values already in real, shipped use, not aspirational ones - each references one of this page's own tokens.

        Button
        Icon-to-label gap; horizontal padding scales with height (12/16/20/24px across the five larger sizes)
        8px gap

        Table
        Cell vertical padding (Large); Middle/Small densities step down to 6px and 4px
        8px

        Modal
        Two different paddings, not one: the scrim's own padding keeps the dialog off the viewport edge; the dialog's internal content padding is separate and smaller
        24px scrim · 16px/20px content

        Drawer
        Same scrim-vs-content split as Modal: scrim padding keeps the panel off the viewport edge; the panel's own content padding is the same value Modal's dialog content uses
        16px scrim · 16px/20px content

        Panel / Card container
        Internal padding; Compact density (Settings → Density) steps down to 16px
        24px

        Form field
        Vertical gap between label, control and helper/error text - all three in one column, one consistent gap, not a different value per pair
        6px gap

        List
        Row padding and icon/text gap (Middle density); Small steps down to 6px/8px, Large up to 14px/12px
        10px padding · 10px gap

        Empty state
        Panel padding and the gap between icon, heading and body text
        24px padding · 10px gap

Said plainly, not invented to fill a row: a checkbox/radio group and a toolbar don't have their own formalized spacing value yet - the closest real analog today is Form field's 6px for a checkbox/radio group, and a toolbar isn't a distinct component in this library at all (compose it from Button + the Layout spacing scale above). Wrapped/long content in any of these follows the component's own reflow behavior, not a separate spacing rule.

{}

## Spacing tokens - Markdown export
    
A Markdown snapshot of your current product type and spacing system choices above - regenerates live as you pick, so it's always in sync. Copy it straight into your design system docs or hand it to an AI/agent workflow.

      Copy Markdown

## Implementation contract

Saved validated choices override project recommendations, which override system defaults. This implementation contract governs static specimens. Resolved tokens in the current export are authoritative values. Component exceptions must name the affected role and reason.

### Scale algorithm
2px, 4px and 8px systems round requested steps to their selected quantum. Adaptive uses 2px at requested steps up to 6px, 4px above 6px and below 32px, and 8px from 32px. Positive steps smaller than their quantum keep their original value. --space-n is a compatibility request slot; its resolved value is authoritative. This differs from immutable numeric radius primitives.

### Allowed values
Use resolved space tokens for component gaps and padding. Zero is permitted for attached surfaces. auto is permitted for centering/available-space distribution. Percent/viewport units belong to explicitly documented container sizing. Negative margins require a named overlap exception and must not clip focus or targets.

### Composition examples
Use 8px label-to-field, 4px field-to-error, 16px field-to-field, 8px checkbox/radio glyph-to-label, 8px related toolbar actions, 24px panel content and 32px between major groups as semantic requests resolved by the active scale. Wrapped labels align with the first line; error text occupies its own row without moving unrelated controls.

### Density and targets
Comfortable/compact density affects visual spacing, never the minimum 44px product target. Glyph size, field height and hit area are separate. Reserve room for multilingual labels and validation. A 24px icon is not a 24px touch target.

### Context and responsive rules
Single-platform context wins for unsaved recommendations; explicit selection wins thereafter. Cross-Platform is one active scale with documented density/layout variants, not simultaneous conflicting global bases. Logical gutters are equal. Fluid outer padding may interpolate between approved endpoint tokens; internal spacing remains token-based.

### Export
Export algorithm, resolved scale, relationship roles, density/target rules, direction and exceptions. Show px/rem equivalents and explain native dp/sp adaptation rather than claiming native CSS support.

### Save and edit
Selections preview immediately. Save foundation commits valid settings in this browser and locks the editor. Select Edit foundation to revise saved settings; Cancel retains the saved settings. Storage failure keeps the draft editable.
Machine contract: section rules, storage, units and acceptance
{
  "schemaVersion": 1,
  "authority": "Saved validated choices override project recommendations, which override system defaults. This implementation contract governs static specimens. Resolved tokens in the current export are authoritative values. Component exceptions must name the affected role and reason.",
  "governance": {
    "owners": "Design System Lead owns token and compatibility policy. Designers own specimens and interaction contracts. Developers own resolver/export/import parity. QA and Accessibility own release evidence. Product teams own domain-specific confidence, privacy and retention policies.",
    "changes": "Change the JSON contract first, regenerate documentation/defaults/catalog/tokens, then run model, DOM and recipient checks. Link the changed finding IDs and evidence in the release review.",
    "compatibility": "Keep hue-named CSS tokens as compatibility aliases while semantic consumers migrate. Additive tokens retain schemaVersion 1. A removed/renamed key or changed stored meaning requires a schema migration, a version bump and a documented replacement before release. Keep the prior reader fixture until the migration is verified.",
    "deprecation": "Record old key, replacement, reason, introduced version, planned removal version and affected consumers. Do not remove a token while an active consumer still uses it. Future records are preserved rather than coerced.",
    "scope": "This is a web design system with one shared workspace profile. Native dp/sp adaptation and real agent execution require separate adapters and acceptance. User-defined colors and responsive exceptions require product-specific rendered verification."
  },
  "storage": {
    "version": 1,
    "legacy": "Unversioned valid records migrate in memory. Typography headingScaleVersion 2 applies the smaller six-heading scale once to older records, retaining other roles and existing font/color/style metrics. Later custom size edits are retained. Unsupported future records are preserved. The next successful write stamps the migrated version.",
    "future": "Reject unsupported future versions. Preserve raw data. Offer backup and explicit reset.",
    "invalid": "Foundation selections preview locally until Save foundation succeeds. Saved Foundation editors require Edit foundation before changes. Cancel discards the preview. Invalid drafts never replace saved records; storage failures retain the editable preview and the last durable record.",
    "concurrency": "A storage event refreshes applied tokens and disables stale editor controls until reload. Never merge simultaneous edits silently."
  },
  "units": {
    "base": "1rem = 16px at default browser settings. Do not fix the root font size.",
    "use": "Prefer rem for typography, spacing and control dimensions. Hairline borders and viewport thresholds may use px. Both equivalents appear in Markdown. SVG strokes use viewBox units. Ratios, percentages, columns, timing and weights are unitless or retain their own units.",
    "native": "Web CSS px/rem are not native dp/sp. A native adapter must map semantic roles, support text scaling and test device density. Native rendering is not shipped by this web library."
  },
  "acceptance": [
    "Compare page, applied tokens, durable record, Machine View and exported instructions.",
    "Test valid, unfinished, invalid, missing, malformed, legacy and future records. Exercise storage failure, reset, reload and another tab.",
    "Test 320, 375, 768, 1024 and 1440px widths, 200% zoom, text-spacing overrides, RTL and long/localized labels.",
    "Use keyboard and screen reader. Confirm focus return, names, values, error associations and status announcements.",
    "Verify actual rendered text/surface pairs, forced colors, reduced motion, print and exported recipes in a recipient fixture. Source or DOM checks alone are not rendered acceptance."
  ],
  "layers": {
    "content": 0,
    "sticky": 20,
    "popover": 40,
    "scrim": 60,
    "dialog": 70,
    "toast": 80,
    "tooltip": 90,
    "rules": "Each overlay gets an explicit owner and close/focus-return path. Portal menus out of clipped scroll containers. Nested dialogs stack one scrim per modal owner. Escape closes the top dismissible layer. Tooltips never block actions. Test collision and zoom; do not infer stacking order from shadow size."
  },
  "section": {
    "title": "Spacing",
    "rules": {
      "Scale algorithm": "2px, 4px and 8px systems round requested steps to their selected quantum. Adaptive uses 2px at requested steps up to 6px, 4px above 6px and below 32px, and 8px from 32px. Positive steps smaller than their quantum keep their original value. --space-n is a compatibility request slot; its resolved value is authoritative. This differs from immutable numeric radius primitives.",
      "Allowed values": "Use resolved space tokens for component gaps and padding. Zero is permitted for attached surfaces. auto is permitted for centering/available-space distribution. Percent/viewport units belong to explicitly documented container sizing. Negative margins require a named overlap exception and must not clip focus or targets.",
      "Composition examples": "Use 8px label-to-field, 4px field-to-error, 16px field-to-field, 8px checkbox/radio glyph-to-label, 8px related toolbar actions, 24px panel content and 32px between major groups as semantic requests resolved by the active scale. Wrapped labels align with the first line; error text occupies its own row without moving unrelated controls.",
      "Density and targets": "Comfortable/compact density affects visual spacing, never the minimum 44px product target. Glyph size, field height and hit area are separate. Reserve room for multilingual labels and validation. A 24px icon is not a 24px touch target.",
      "Context and responsive rules": "Single-platform context wins for unsaved recommendations; explicit selection wins thereafter. Cross-Platform is one active scale with documented density/layout variants, not simultaneous conflicting global bases. Logical gutters are equal. Fluid outer padding may interpolate between approved endpoint tokens; internal spacing remains token-based.",
      "Export": "Export algorithm, resolved scale, relationship roles, density/target rules, direction and exceptions. Show px/rem equivalents and explain native dp/sp adaptation rather than claiming native CSS support.",
      "Save and edit": "Selections preview immediately. Save foundation commits valid settings in this browser and locks the editor. Select Edit foundation to revise saved settings; Cancel retains the saved settings. Storage failure keeps the draft editable."
    }
  }
}

---

## Spin

Source: spin-default.html · Status: Available

Components · Feedback · Spin
  Back to Spin types

# Spin
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
Use for indicating that something is happening with no known duration or completion percentage - a small ring that spins continuously until the operation finishes, in 3 sizes and 3 states, controlled by properties.

## Properties

Label is a property of the same component, not a separate control - change it below to check its effect across the With label and Overlay states in the Live Preview. Spinning shows only the bare ring regardless of Label, since it represents the leanest inline case with no accompanying text.

        Label

## Live Preview
    
All 3 sizes compared side by side, each in all 3 states - Spinning is the bare ring alone, With label adds the current Label text beside it, and Overlay centers the ring and label over a dimmed content placeholder.

## When to use
    
Any moment where something is actively happening but there is no known percentage or shape to show for it.

      Inline button loading state
      Section/panel content loading
      Initial page load overlay
      Async search or filter in progress
      Form submission in flight

## Component Guide

        Human View
        Machine View

Overview
      
Spin indicates that something is happening with no known duration or completion percentage - a small ring that spins continuously until the operation finishes, used whenever there's genuinely no measurable progress to show.

When to Use

- An inline button loading state - showing an action is in flight after a click.
        
- Section or panel content loading with no known shape or percentage - a generic in-progress signal.
        
- An async search, filter, or form submission in flight - any short wait with no meaningful progress fraction.

When Not to Use

- An operation with a real, known percentage complete - use Progress instead - showing a spinner when real progress data exists hides useful information.
        
- Content whose eventual shape is already known - use Skeleton so the layout doesn't jump once it loads.
        
- A wait long enough that the user needs more context (time remaining, what's happening) - pair Spin with actual status text, or reconsider whether Progress fits better.

Best Practices

- Keep it small and contextual - inline in a button or panel, not a full-page takeover unless the whole page truly depends on it.
        
- Pair it with a brief label ("Loading...", "Searching...") when the context alone doesn't make the wait obvious.
        
- Disable the control it's attached to while spinning, so the same action can't be triggered twice.

Do and Don't

Do

Searching...
          
Used where there is genuinely no percentage to report, and paired with a word about what is happening.

Don't

A bare spinner on a long wait leaves the user unable to tell progress from a hang. Add a label, or use Progress when the total is known.

Accessibility

- Carries role="status" (or aria-live="polite" plus aria-busy="true") on the spinning element itself - a screen-reader user must hear that loading has started and hear again when it ends, since the ring's motion is entirely invisible to them.
        
- Never the only feedback for a long wait - pair with text for anything beyond a couple of seconds, and make sure that text is inside the same live region so its updates are announced too.
        
- Doesn't trap focus or block keyboard navigation elsewhere on the page unless the underlying operation genuinely requires it.

Related Components
      
Progress, Skeleton, Button.

{
  "component": "Spin",
  "category": "Feedback",
  "summary": "Spin indicates that something is happening with no known duration or completion percentage - a small ring that spins continuously until the operation finishes, used whenever there's genuinely no measurable progress to show.",
  "whenToUse": [
    "An inline button loading state - showing an action is in flight after a click.",
    "Section or panel content loading with no known shape or percentage - a generic in-progress signal.",
    "An async search, filter, or form submission in flight - any short wait with no meaningful progress fraction."
  ],
  "whenNotToUse": [
    "An operation with a real, known percentage complete - use Progress instead - showing a spinner when real progress data exists hides useful information.",
    "Content whose eventual shape is already known - use Skeleton so the layout doesn't jump once it loads.",
    "A wait long enough that the user needs more context (time remaining, what's happening) - pair Spin with actual status text, or reconsider whether Progress fits better."
  ],
  "bestPractices": [
    "Keep it small and contextual - inline in a button or panel, not a full-page takeover unless the whole page truly depends on it.",
    "Pair it with a brief label (\"Loading...\", \"Searching...\") when the context alone doesn't make the wait obvious.",
    "Disable the control it's attached to while spinning, so the same action can't be triggered twice."
  ],
  "doAndDont": {
    "do": "Used where there is genuinely no percentage to report, and paired with a word about what is happening.",
    "dont": "A bare spinner on a long wait leaves the user unable to tell progress from a hang. Add a label, or use Progress when the total is known."
  },
  "accessibility": [
    "Carries role=\"status\" (or aria-live=\"polite\" plus aria-busy=\"true\") on the spinning element itself - a screen-reader user must hear that loading has started and hear again when it ends, since the ring's motion is entirely invisible to them.",
    "Never the only feedback for a long wait - pair with text for anything beyond a couple of seconds, and make sure that text is inside the same live region so its updates are announced too.",
    "Doesn't trap focus or block keyboard navigation elsewhere on the page unless the underlying operation genuinely requires it."
  ],
  "relatedComponents": [
    "Progress",
    "Skeleton",
    "Button"
  ]
}

---

## Spin

Source: spin.html · Status: Available

Components · Feedback

# Spin
  
A small, continuously rotating ring that communicates an indeterminate "please wait" loading state - used inline within a button, beside a line of text, or centered over a section of content that is temporarily loading. Distinct from Progress, which shows a known completion percentage, and from Skeleton, which shows content-shaped placeholder blocks - Spin has no known percentage or shape, only that something is happening.

## Spin type

Copy a ready-to-paste AI prompt or the working code - both use this system's own color tokens and Inter, never arbitrary values. Click the card to configure it in full.

            Loading...

System Control

          Copy prompt

---

## Splitter Experimental

Source: splitter-default.html · Status: Available

Components · Data Display · Splitter
  Back to Splitter types

# Splitter Experimental
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
Use for a resizable two-panel layout with a draggable divider between them, like a resizable sidebar next to a main content area - one Splitter component, controlled by properties, not a one-off resize handle wired up per screen.

## Properties

Panel labels and split ratio are properties of the same component, not separate layouts - change them below to check both types and every state in the Live Preview.

        First panel label

        Second panel label

        Split ratio (%)

## Live Preview
    
Both types compared side by side, each in 3 states - Default (static split at the chosen ratio), Dragging (the divider highlighted mid-resize) and Collapsed (the first panel collapsed to a thin strip). One preview is rendered at the chosen panel labels and ratio.

## Try it
    
The matrix shows Dragging as a still frame so it can sit beside the other states. This one is live: drag or use arrow keys to resize. Enter collapses/restores the first pane; Home/End use its bounds. Both expanded panes keep at least 64px when space permits. The chosen ratio is saved on this device; reset removes it.

## When to use
    
Any layout where two adjacent panels should share space, and the user benefits from adjusting exactly how much each one gets.

      Resizable sidebar
      Code editor + preview pane
      File tree + detail view
      Master/detail layout
      Chat list + conversation pane

## Component Guide

        Human View
        Machine View

Overview
      
Splitter is a resizable two-panel layout with a draggable divider between them - the user drags the divider to redistribute space between the two panels, and either panel can optionally collapse to a thin strip to temporarily reclaim its space.

When to Use

- A resizable sidebar next to a main content area - a file tree, a navigation panel, or a filters panel.
        
- A code editor and its live preview pane - both panels visible, resizable to taste.
        
- A master/detail layout - a list panel and a detail panel, like a chat list next to a conversation pane.

When Not to Use

- A fixed layout where resizing adds no value - don't add a Splitter just because two things sit side by side; only when the user genuinely benefits from adjusting the ratio.
        
- Narrow or mobile viewports - a draggable divider is impractical on touch-first layouts; stack the panels instead.
        
- More than two panels needing independent resizing - nest multiple Splitters deliberately rather than trying to force one divider to manage three or more regions.

Best Practices

- Persist the user's chosen split ratio across sessions when the layout is one they'll return to repeatedly.
        
- Enforce sensible minimum sizes on both panels so neither can be dragged down to an unusable sliver.
        
- Make the divider's hit target noticeably wider than its visible line, so it's easy to grab precisely.

Do and Don't

Do

File tree

Editor
          
Two panels the user genuinely wants to resize against each other, with a visible drag handle marking the boundary.

Don't

Icons

Main content
          
A 15%-wide panel gives the user almost nothing to drag toward - there is no meaningful second layout to resize into. Use a fixed Sidebar instead.

Accessibility

- The divider is a real, keyboard-operable control (arrow keys nudge the split ratio), not a mouse-only drag handle.
        
- The divider exposes its current position and valid range to assistive technology, similar to a slider.
        
- A collapsed panel's expand control has an accessible name identifying which panel it restores.

Related Components
      
Transfer, Card, Tabs.

{
  "component": "Splitter",
  "status": "Experimental",
  "category": "Data Display",
  "summary": "Splitter is a resizable two-panel layout with a draggable divider between them, letting the user redistribute space between the two panels.",
  "whenToUse": [
    "A resizable sidebar next to a main content area.",
    "A code editor and its live preview pane, both resizable.",
    "A master/detail layout, like a chat list next to a conversation pane."
  ],
  "whenNotToUse": [
    "A fixed layout where resizing adds no real value.",
    "Narrow or mobile viewports where a draggable divider is impractical.",
    "More than two panels needing independent resizing - nest multiple Splitters instead."
  ],
  "bestPractices": [
    "Persist the user's chosen split ratio across sessions for layouts they return to.",
    "Enforce sensible minimum sizes on both panels.",
    "Make the divider's hit target wider than its visible line."
  ],
  "doAndDont": {
    "do": "Two panels the user genuinely wants to resize against each other, with a visible drag handle marking the boundary.",
    "dont": "A 15%-wide panel gives the user almost nothing to drag toward - there is no meaningful second layout to resize into. Use a fixed Sidebar instead."
  },
  "accessibility": [
    "The divider is keyboard-operable (arrow keys nudge the split ratio), not mouse-only.",
    "The divider exposes its current position and valid range, similar to a slider.",
    "A collapsed panel's expand control has an accessible name identifying which panel it restores."
  ],
  "relatedComponents": [
    "Transfer",
    "Card",
    "Tabs"
  ]
}

---

## Splitter

Source: splitter.html · Status: Available

Components · Data Display

# Splitter
  
A resizable layout with two panels separated by a draggable divider - lets someone adjust how much space each side of a panel gets, like a resizable sidebar next to a main content area.

## Splitter type

Copy a ready-to-paste AI prompt or the working code - both use this system's own color tokens and Inter, never arbitrary values. Click the card to configure it in full.

Sidebar

Content

System Control

          Copy prompt

---

## Statistic Experimental

Source: statistic-default.html · Status: Available

Components · Data Display · Statistic
  Back to Statistic types

# Statistic Experimental
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
Use to display a single quantifiable number prominently, like a KPI, a live count, or a metric with a trend - one Statistic component, controlled by properties, not a one-off big number hard-coded per dashboard tile.

## Properties

Title, value, prefix and suffix are properties of the same component, not separate tiles - change them below to check every type and color in the Live Preview.

        Title

        Value

        Prefix

        Suffix

## Live Preview
    
All 3 types compared side by side, each in 4 states - Default, Positive, Negative and Loading. Loading replaces the title and value with an animated placeholder. One matrix is rendered at the chosen Title, Value, Prefix and Suffix.

## When to use
    
Any place a single quantifiable number needs to stand out at a glance, like a dashboard tile or a summary card.

      Dashboard KPI tile
      Revenue/growth metric
      Live counter
      Usage/quota summary
      Report headline number

## Component Guide

        Human View
        Machine View

Overview
      
Statistic displays a single quantifiable number prominently - a title above a large, bold value, with an optional prefix (like a currency symbol), suffix (like a unit or percent sign), and a colored trend indicator - built for dashboard tiles and summary cards where one number needs to stand out at a glance.

When to Use

- A dashboard KPI tile - active users, total revenue, open tickets.
        
- A metric with a trend - growth or decline versus a prior period, shown with a colored arrow.
        
- A live counter or a countdown - a value that updates over time but is always shown as one prominent number.

When Not to Use

- Several related numbers that need to be compared side by side in rows and columns - use Table or Description instead of several standalone Statistic tiles.
        
- A number the user needs to edit - use Number or Input; Statistic is read-only, display-only.
        
- A value with no real numeric significance - a plain label or Tag communicates a status better than dressing it up as a number.

Best Practices

- Keep the title short and unambiguous - a viewer should know exactly what the number represents without extra context.
        
- Format large numbers with separators (112,893, not 112893) so they're readable at a glance - use the locale-correct separator from Data Format rather than hard-coding a comma, since Statistic itself doesn't define number formatting.
        
- Reserve the positive/negative trend coloring for values that are genuinely good or bad news - don't color a neutral count green or red by default.

Do and Don't

Do

Monthly active users
48,204▲ 12%
          
One number, labelled plainly, with the trend that gives it meaning - up from what, and by how much.

Don't

Users
48204.37219
          
Raw unrounded precision on a headline number reads as noise, not confidence - it forces the reader to mentally truncate it themselves.

Accessibility

- The title and value are both real text, read together by screen readers as one meaningful statement, not conveyed by size or color alone.
        
- Trend direction is stated in text or via an icon with an accessible label ("up 12.5%"), not communicated by arrow shape or color alone.
        
- The loading state is marked so assistive technology announces that the value is not yet available, rather than reading an empty placeholder.

Related Components
      
Description, Progress, Badge.

{
  "component": "Statistic",
  "status": "Experimental",
  "category": "Data Display",
  "summary": "Statistic displays a single quantifiable number prominently - a title above a large, bold value, with an optional prefix, suffix, and a colored trend indicator - built for dashboard tiles and summary cards.",
  "whenToUse": [
    "A dashboard KPI tile - active users, total revenue, open tickets.",
    "A metric with a trend - growth or decline versus a prior period, shown with a colored arrow.",
    "A live counter or a countdown - a value that updates over time but is always shown as one prominent number."
  ],
  "whenNotToUse": [
    "Several related numbers that need to be compared side by side in rows and columns - use Table or Description instead of several standalone Statistic tiles.",
    "A number the user needs to edit - use Number or Input; Statistic is read-only, display-only.",
    "A value with no real numeric significance - a plain label or Tag communicates a status better than dressing it up as a number."
  ],
  "bestPractices": [
    "Keep the title short and unambiguous.",
    "Format large numbers with separators (112,893, not 112893).",
    "Reserve positive/negative trend coloring for values that are genuinely good or bad news."
  ],
  "doAndDont": {
    "do": "One number, labelled plainly, with the trend that gives it meaning - up from what, and by how much.",
    "dont": "Raw unrounded precision on a headline number reads as noise, not confidence - it forces the reader to mentally truncate it themselves."
  },
  "accessibility": [
    "Title and value are read together by screen readers as one meaningful statement.",
    "Trend direction is stated in text or an accessible label, not color/shape alone.",
    "The loading state is marked so assistive technology announces the value is not yet available."
  ],
  "relatedComponents": [
    "Description",
    "Progress",
    "Badge"
  ]
}

---

## Statistic

Source: statistic.html · Status: Available

Components · Data Display

# Statistic
  
A compact, high-emphasis display for a single quantifiable number - a KPI, a count, or a live metric - with a label above it and an optional prefix, suffix, or trend indicator.

## Statistic type

Copy a ready-to-paste AI prompt or the working code - both use this system's own color tokens and Inter, never arbitrary values. Click the card to configure it in full.

Active Users
            
112,893

System Control

          Copy prompt

---

## Steps

Source: steps-default.html · Status: Available

Components · Navigation · Steps
  Back to Steps types

# Steps
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
Shows position within a multi-step flow, like a checkout or onboarding wizard - one Steps component, controlled by properties, not separate labels glued together.

## Properties

Orientation, size and labels are properties of the same component, not separate steps glued together - change them below to check this flow's style and states in the Live Preview. Step count follows the number of labels entered - use Step count for a quick bump (fills in generic "Step N" labels), or edit Labels directly for custom text.

        Orientation

        Size

        Step count

        Labels

## Live Preview
    
Each row shows the middle step's status in realistic context - steps before it always render as completed, steps after it always render as upcoming. One full matrix is rendered per selected Size x Orientation combination.

## When to use
    
Any flow where a person needs to see how far along they are, and what's left, across a fixed sequence of steps.

      Checkout flow
      Onboarding wizard
      Multi-page form
      Setup progress

## Component Guide

        Human View
        Machine View

Overview
      
Steps shows position within a multi-step flow, like a checkout or onboarding wizard - numbered circles connected by a line, each marked completed, current, or upcoming, so the user always knows how far along they are and what's left. Runs horizontal (left to right) or vertical (top to bottom, circle beside its label) via the Orientation property.

When to Use

- A checkout flow - Details, Shipping, Payment.
        
- An onboarding wizard or multi-page form - showing progress across a fixed sequence.
        
- Setup progress - a guided configuration flow with a known number of stages.

When Not to Use

- A set of related but independent views with no required order - use Tabs instead, since Steps implies a strict sequence.
        
- A location within a nested hierarchy rather than a linear sequence - use Breadcrumb.
        
- A flow with an unknown or highly variable number of stages - Steps works best with a fixed, known step count; consider Progress instead if the total isn't fixed.

Best Practices

- Keep step labels short and in plain, parallel language ("Details", "Shipping", "Payment").
        
- Let users navigate back to a completed step when the flow allows revisiting earlier choices.
        
- Reflect real progress accurately - never mark a step completed before its content has actually been filled in or confirmed.

Do and Don't

Do

✓Account
2Shipping
3Payment
          
Three steps in a checkout, each a short noun, with completed ones marked done - the user always knows what is left.

Don't

✓Step 1
2Step 2
3Step 3
4Step 4
5Step 5
6Step 6
          
Generic "Step 2" labels tell the user nothing about what that step actually involves, and six steps for a routine checkout signals more work than the task deserves.

Accessibility

- The current step is announced distinctly from completed and upcoming steps, not communicated by color alone.
        
- If steps are clickable for backward navigation, they're implemented as real, keyboard-operable controls.
        
- The connector lines are purely decorative and hidden from assistive technology.

Related Components
      
Tabs, Breadcrumb, Progress.

{
  "component": "Steps",
  "category": "Navigation",
  "summary": "Steps shows position within a multi-step flow, like a checkout or onboarding wizard - numbered circles connected by a line, each marked completed, current, or upcoming, so the user always knows how far along they are and what's left. Runs horizontal or vertical via the Orientation property.",
  "whenToUse": [
    "A checkout flow - Details, Shipping, Payment.",
    "An onboarding wizard or multi-page form - showing progress across a fixed sequence.",
    "Setup progress - a guided configuration flow with a known number of stages."
  ],
  "whenNotToUse": [
    "A set of related but independent views with no required order - use Tabs instead, since Steps implies a strict sequence.",
    "A location within a nested hierarchy rather than a linear sequence - use Breadcrumb.",
    "A flow with an unknown or highly variable number of stages - Steps works best with a fixed, known step count; consider Progress instead if the total isn't fixed."
  ],
  "bestPractices": [
    "Keep step labels short and in plain, parallel language (\"Details\", \"Shipping\", \"Payment\").",
    "Let users navigate back to a completed step when the flow allows revisiting earlier choices.",
    "Reflect real progress accurately - never mark a step completed before its content has actually been filled in or confirmed."
  ],
  "doAndDont": {
    "do": "Three steps in a checkout, each a short noun, with completed ones marked done - the user always knows what is left.",
    "dont": "Generic \"Step 2\" labels tell the user nothing about what that step actually involves, and six steps for a routine checkout signals more work than the task deserves."
  },
  "accessibility": [
    "The current step is announced distinctly from completed and upcoming steps, not communicated by color alone.",
    "If steps are clickable for backward navigation, they're implemented as real, keyboard-operable controls.",
    "The connector lines are purely decorative and hidden from assistive technology."
  ],
  "relatedComponents": [
    "Tabs",
    "Breadcrumb",
    "Progress"
  ]
}

---

## Steps

Source: steps.html · Status: Available

Components · Navigation

# Steps
  
A progress indicator showing position within a multi-step flow, like a checkout or onboarding wizard - horizontal or vertical, both configured on the same component.

## Steps type

Copy a ready-to-paste AI prompt or the working code - both use this system's own color tokens and Inter, never arbitrary values. Click the card to configure it in full.

Details

2Shipping

3Payment

Steps

          Copy prompt

Details

2Shipping

3Payment

Vertical Steps

          Copy prompt

---

## Switch

Source: switch-default.html · Status: Available

Components · Forms · Switch
  Back to Switch types

# Switch
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
Use for instantly toggling a single setting on or off, like enabling notifications or switching to airplane mode - the change takes effect immediately, with no separate confirm step.

## Properties

Size and label are properties of the same component, not separate switches - change them below to check this control's states in the Live Preview. Switches are always fully pill-shaped, so there is no corner-radius property.

        Size

        Label

        Label placement
        
          Right of switch
          Left of switch

        State icons

          check/line inside the thumb

        Supporting text

          shown below the switch

        Supporting text

        Error

          shown below the switch

        Error message

## Live Preview
    
Both types compared side by side, each in all 6 states - Hover, Focused and Disabled are demonstrated on top of the Off visual, since a switch is only ever fully Off or fully On; Loading is shown On, since that's the more common case of a setting mid-save. One full matrix is rendered per selected Size.

## Try it
    
The comparison matrix above freezes each state to demonstrate it. This instance is real: click or press Space to toggle it. "Simulate failure" makes the next toggle show Loading, then revert to its previous value and surface the error message above, instead of completing.

        Simulate failure

          next toggle reverts and errors

## When to use
    
Any single setting that takes effect immediately when flipped, with no need to confirm or submit.

      Notification toggle
      Dark mode
      Feature flag
      Airplane mode

## Validation
    
Switch applies instantly with no submit step, so the usual required/validate-on-submit pattern doesn't apply the way it does to Checkbox - most switches have no "wrong" state to validate.

- Required marking - only add one when a Switch sits inside a form and a specific state must be true before submission, such as a compliance or eligibility toggle - mark it the same way as a required checkbox, not with a separate convention.
      
- Validation timing - for that in-form case, validate on submit, matching Checkbox.
      
- Error message - keep it next to that switch's own label, naming what's required, e.g. "You must confirm you're over 18 to continue."
      
- Standalone settings - a settings-page Switch with no form and no wrong answer has no required or invalid state - don't force validation UI onto it just because the pattern exists elsewhere.

## Component Guide

        Human View
        Machine View

Overview
      
Switch is for instantly toggling a single, independent setting on or off - the change takes effect immediately with no separate confirm or submit step, unlike a Checkbox inside a form that waits for the whole form to be submitted.

When to Use

- A setting that applies the moment it's flipped - a notification toggle, dark mode.
        
- A feature flag or experimental setting - turned on/off independently of any form.
        
- A device-level or system-level toggle - airplane mode.

When Not to Use

- A setting that needs explicit confirmation before it takes effect - use Checkbox plus a Save button, or a confirmation dialog for risky changes.
        
- More than two states - Switch is strictly binary; use Group Button or Select for three or more options.
        
- A choice that's part of a larger form submitted together - Checkbox communicates that context more clearly than an instantly-applied Switch.

Best Practices

- Label the setting by its "on" state clearly ("Notifications", not "Enable") so the label reads correctly in both positions.
        
- Reflect the change immediately in whatever the switch controls, so the user gets instant confirming feedback.
        
- Avoid using Switch for anything destructive or hard to reverse without pairing it with a follow-up confirmation.

Do and Don't

Do
          
Dark mode
          
Named for the setting itself, and it applies the instant it is flipped - no Save step to hunt for.

Don't
          
Enable dark mode setting?Save
          
A Switch that only takes effect after a separate Save contradicts what a switch promises. Use a Checkbox when the change is submitted with a form.

Accessibility

- Exposed with a real switch or checkbox role, with the current state (on/off) announced to assistive technology.
        
- The label describes the setting itself, not the mechanism ("Dark mode", not "Toggle switch").
        
- On/off is never communicated by color alone - the thumb's position and track fill both change too.

Related Components
      
Checkbox, Radio, Group Button.

{
  "component": "Switch",
  "category": "Forms",
  "summary": "Switch is for instantly toggling a single, independent setting on or off - the change takes effect immediately with no separate confirm or submit step, unlike a Checkbox inside a form that waits for the whole form to be submitted.",
  "whenToUse": [
    "A setting that applies the moment it's flipped - a notification toggle, dark mode.",
    "A feature flag or experimental setting - turned on/off independently of any form.",
    "A device-level or system-level toggle - airplane mode."
  ],
  "whenNotToUse": [
    "A setting that needs explicit confirmation before it takes effect - use Checkbox plus a Save button, or a confirmation dialog for risky changes.",
    "More than two states - Switch is strictly binary; use Group Button or Select for three or more options.",
    "A choice that's part of a larger form submitted together - Checkbox communicates that context more clearly than an instantly-applied Switch."
  ],
  "bestPractices": [
    "Label the setting by its \"on\" state clearly (\"Notifications\", not \"Enable\") so the label reads correctly in both positions.",
    "Reflect the change immediately in whatever the switch controls, so the user gets instant confirming feedback.",
    "Avoid using Switch for anything destructive or hard to reverse without pairing it with a follow-up confirmation."
  ],
  "doAndDont": {
    "do": "Named for the setting itself, and it applies the instant it is flipped - no Save step to hunt for.",
    "dont": "A Switch that only takes effect after a separate Save contradicts what a switch promises. Use a Checkbox when the change is submitted with a form."
  },
  "accessibility": [
    "Exposed with a real switch or checkbox role, with the current state (on/off) announced to assistive technology.",
    "The label describes the setting itself, not the mechanism (\"Dark mode\", not \"Toggle switch\").",
    "On/off is never communicated by color alone - the thumb's position and track fill both change too."
  ],
  "relatedComponents": [
    "Checkbox",
    "Radio",
    "Group Button"
  ]
}

---

## Switch

Source: switch.html · Status: Available

Components · Forms

# Switch
  
A pill-shaped on/off toggle for a single setting - flips a binary state instantly, no confirmation needed.

## Switch type

Copy a ready-to-paste AI prompt or the working code - both use this system's own color tokens and Inter, never arbitrary values. Click the card to configure it in full.

            Enable notifications

Switch

          Copy prompt

---

## Table

Source: table-default.html · Status: Available

Components · Data Display · Table
  Back to Table types

# Table
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
Use for displaying structured data across fixed columns, like an admin data grid or a report view - one Table component, controlled by properties, not a one-off grid of divs rebuilt per screen.

## Properties

Corner radius, size and the header row are properties of the same component, not separate tables - change them below to check this table's types and states in the Live Preview.

        Corner radius

        Size

        Show header

          column labels above the rows

## Live Preview
    
Both types compared side by side, each in all 5 states - plain rows, Striped for alternating row backgrounds, Selected showing a checkbox column with one row highlighted, Loading, and Empty. One full matrix is rendered per selected combination of Corner radius and Size, with the current Show header setting applied throughout.

## When to use
    
Any time structured data needs to be shown across fixed columns rather than as a list or grid of cards.

      Admin data grid
      User management list
      Order history
      Report/analytics view
      Inventory listing

## Selection
    
Row selection is one of three modes per table instance, not a single on/off switch - pick the one that matches what an action needs to operate on.

- None - rows aren't selectable. No checkbox column, no row highlight on click; a click (if it does anything) navigates or expands the row instead of selecting it.
      
- Single-row - clicking a row selects it exclusively, like a radio group: selecting a different row clears the previous selection. Use when exactly one record is ever acted on at a time.
      
- Multi-row (checkbox column) - a leading checkbox column: one checkbox per row, plus a header checkbox that selects or deselects every row currently visible. When some but not all visible rows are checked, the header checkbox renders indeterminate - a dash, not a checkmark or an empty box - rather than falsely claiming everything or nothing is selected.

Keyboard: a selectable row is a focusable element (tabindex="0"); pressing Space while a row has focus toggles that row's selection, without requiring the pointer to land precisely on the checkbox.

## Sort
    
Sorting can happen entirely in the browser or round-trip to the server, depending on how much of the dataset is already loaded.

- Client-side sort - re-orders rows already loaded in memory. Fine for small, fully-loaded datasets where every row is already on the page.
      
- Server-side sort - re-requests the current page/window from the server on every sort change. Required once pagination or virtualization is itself server-driven, so sorting one column doesn't mean silently fetching the entire dataset just to reorder it locally.
      
- Multi-column sort - single-column sort is the default; supporting a secondary sort key (e.g. shift-click a header to add it) is an opt-in advanced behavior, not something every Table instance is required to implement.

Accessibility contract - per WCAG 2.1 Success Criterion 4.1.3 (Status Messages), a sortable column header must expose its current state via aria-sort="ascending", aria-sort="descending" or aria-sort="none" on the <th>, update that attribute the instant the sort changes, and announce the change to assistive technology - a visual arrow icon alone is not sufficient.

## Filter
    
Filtering narrows which rows show, through either a scoped per-column control or a single global search - and the resulting empty state needs to say which situation it is.

- Per-column filter - a control scoped to one field, e.g. a status dropdown inside the Status column's header, narrowing on that attribute alone.
      
- Global search bar - one search input above the table that matches across every visible column at once, for a user who doesn't know which column their query lives in.

"No rows match" is not the same empty state as "no data at all." A filtered-to-zero result (rows exist, the current filter or search just matched none of them) should say so and offer a "Clear filters" action; the true empty state (no data exists, prior to any filter) should instead offer a call-to-action to create the first record. Rendering the same message for both hides the fact that data exists somewhere but the filter is too narrow.

## Pagination vs. Virtualization
    
A Table doesn't scale linearly in the DOM as row count grows, so which rendering strategy applies depends on how many rows are in play.

- Below 500 rows - client-side pagination, or simply rendering every row at once, is fine. The DOM cost is small and bounded.
      
- At or above 500 rows - virtualization (windowed rendering, where only the rows in or near the current viewport are ever mounted) is required. A table row is not a cheap DOM node - each one carries multiple cells, and often interactive controls (checkboxes, action buttons) with their own event listeners - so total DOM node count and layout/reflow cost grow far faster than linearly with row count once a table passes a few hundred rows.

## Density
    
A two-value row-height property, independent of the Size property already shown above in Live Preview.

- Comfortable - the default row height and cell padding, matching what's shown throughout this page's Live Preview.
      
- Compact - reduced row height and cell padding, for scanning more rows within the same viewport height.

A sitewide density mode now exists (Settings → Density, backed by a data-density attribute the same way theme is), but Table's Size property above is still its own local control and isn't wired to that sitewide setting yet - the two aren't the same switch. Promote Table's Size onto the sitewide toggle once another data-dense component (List, Description) needs the same switch, rather than each maintaining its own.

## Required States
    
A real, data-backed Table has no fallback "shape" the way this page's static demos do - empty, loading and error all need an explicit, intentional rendering, not an accidental one.

Empty (no data at all)

Do
        
NameStatus

No team members yet
Invite someone to get started.Invite member
        
Reuses the Empty component (icon, title, description) plus a call-to-action that matches the table's content, inside one spanning cell.

Don't
        
NameStatus
        
A header with a silently blank body reads as broken or still loading, never as "there's nothing here yet."

Loading

Do
        
NameStatus
        
Skeleton rows matching the real column count keep the table's shape stable, so it doesn't jump once data arrives.

Don't
        
NameStatus

No results
        
Showing the same "No results" empty state while a fetch is still in flight misreports that there's no data - rows popping in a moment later contradicts what was just displayed.

Error

Do
        
NameStatus

Couldn't load rows
Something went wrong fetching this data.Retry
        
Names what happened and gives a Retry action, inside the same spanning cell used by the other states.

Don't
        
NameStatus

No results
        
A failed request that silently renders the same empty state as a true zero-result answer gives the user no way to tell the two apart, and no path to retry.

## Component Guide

        Human View
        Machine View

Overview
      
Table displays structured data across fixed columns, like an admin data grid or a report view - rows and columns that let a user compare values across many records at once, unlike List's simpler stacked-row layout with no column alignment.

When to Use

- An admin data grid or user management list - structured records compared across shared columns.
        
- Order history or a report/analytics view - tabular data where column alignment aids comparison.
        
- An inventory listing - any dataset naturally organized into consistent fields per row.

When Not to Use

- A simple stack of similar items with no meaningful column structure - use List instead - Table's column overhead isn't worth it for unstructured rows.
        
- A small number of visually distinct content blocks - use Card or a grid of Cards.
        
- Data better suited to a single set of label/value pairs - use Description for one record's details rather than a one-row table.

Best Practices

- Keep column headers concise and consistently aligned with their column's data type (numbers right-aligned, text left-aligned).
        
- Support sorting on columns where order genuinely helps comparison, and clearly indicate the active sort.
        
- Pair large tables with pagination, virtualized scrolling, or both - virtualize once a table is showing 500+ rows, rather than rendering thousands of rows at once.

Do and Don't

Do
          
NameStatusAria ChenActiveLeo FischerInvited
          
Column headers that name exactly one kind of value each, so every cell in a column is comparable to the one above it.

Don't
          
DetailsAria Chen - active - joined Jan 2024 - adminLeo Fischer, invited, pending since last week
          
Collapsing several fields into one free-text column removes the ability to sort, filter or scan by any single attribute - it stops being a table.

Accessibility

- Uses real table semantics (thead/tbody/th with proper scope), so screen readers can announce row/column context for each cell.
        
- Sortable column headers are real, keyboard-operable buttons that announce the current sort direction.
        
- Row selection checkboxes are independently labeled with which row they apply to.
        
- Per WCAG 2.1 Success Criterion 4.1.3 (Status Messages), a sortable header sets aria-sort="ascending", aria-sort="descending" or aria-sort="none" and announces the change - a visual arrow icon alone is not sufficient.

Related Components
      
List, Pagination, Description.

{
  "component": "Table",
  "category": "Data Display",
  "summary": "Table displays structured data across fixed columns, like an admin data grid or a report view - rows and columns that let a user compare values across many records at once, unlike List's simpler stacked-row layout with no column alignment.",
  "whenToUse": [
    "An admin data grid or user management list - structured records compared across shared columns.",
    "Order history or a report/analytics view - tabular data where column alignment aids comparison.",
    "An inventory listing - any dataset naturally organized into consistent fields per row."
  ],
  "whenNotToUse": [
    "A simple stack of similar items with no meaningful column structure - use List instead - Table's column overhead isn't worth it for unstructured rows.",
    "A small number of visually distinct content blocks - use Card or a grid of Cards.",
    "Data better suited to a single set of label/value pairs - use Description for one record's details rather than a one-row table."
  ],
  "bestPractices": [
    "Keep column headers concise and consistently aligned with their column's data type (numbers right-aligned, text left-aligned).",
    "Support sorting on columns where order genuinely helps comparison, and clearly indicate the active sort.",
    "Pair large tables with pagination, virtualized scrolling, or both - virtualize once a table is showing 500+ rows, rather than rendering thousands of rows at once."
  ],
  "doAndDont": {
    "do": "Column headers that name exactly one kind of value each, so every cell in a column is comparable to the one above it.",
    "dont": "Collapsing several fields into one free-text column removes the ability to sort, filter or scan by any single attribute - it stops being a table."
  },
  "accessibility": [
    "Uses real table semantics (thead/tbody/th with proper scope), so screen readers can announce row/column context for each cell.",
    "Sortable column headers are real, keyboard-operable buttons that announce the current sort direction.",
    "Row selection checkboxes are independently labeled with which row they apply to.",
    "Per WCAG 2.1 Success Criterion 4.1.3 (Status Messages), a sortable header sets aria-sort=\"ascending|descending|none\" and announces the change - a visual arrow icon alone is not sufficient."
  ],
  "selection": {
    "modes": ["none", "single-row", "multi-row"],
    "multiRowCheckboxHeader": "Indeterminate (not checked, not unchecked) when some but not all visible rows are selected.",
    "keyboard": "Space toggles selection on a focused row."
  },
  "sort": {
    "clientSide": "Re-orders already-loaded rows in memory - fine for small, fully-loaded datasets.",
    "serverSide": "Re-requests the current page/window from the server on every sort change - required once pagination or virtualization is server-driven.",
    "multiColumn": "Not on by default - single-column sort unless explicitly extended with shift-click to add a secondary sort key.",
    "accessibility": "Per WCAG 2.1 Success Criterion 4.1.3 (Status Messages), a sortable header must expose aria-sort=\"ascending|descending|none\" and announce the change to assistive technology."
  },
  "filter": {
    "perColumn": "A filter control scoped to a single column's field.",
    "global": "A global search bar above the table, matching across every visible column.",
    "emptyStates": "\"No rows match\" (filtered-to-zero, offer Clear filters) must read differently from the true empty state (no data exists at all, offer a create action)."
  },
  "paginationAndVirtualization": {
    "thresholdRows": 500,
    "belowThreshold": "Client-side pagination (or simple full rendering) is sufficient.",
    "atOrAboveThreshold": "Virtualization (windowed rendering) is required - a table row is not a cheap DOM node, and DOM/layout cost does not scale linearly with row count past a few hundred rows."
  },
  "density": {
    "modes": ["comfortable", "compact"],
    "note": "Two-value property local to Table's own Size control, not yet wired to the sitewide data-density attribute (Settings -> Density) that now exists for the shell frame/panels."
  },
  "requiredStates": ["empty", "loading", "error"],
  "relatedComponents": [
    "List",
    "Pagination",
    "Description"
  ]
}

---

## Table

Source: table.html · Status: Available

Components · Data Display

# Table
  
A structured grid of rows and columns for displaying tabular data, with a header row and optional cell borders, alternating row stripes, or row selection.

## Table type

Copy a ready-to-paste AI prompt or the working code - both use this system's own color tokens and Inter, never arbitrary values. Click the card to configure it in full.

                Name
                Status
                Role

                Jordan Lee
                Active
                Product Designer

                Sam Ortiz
                Active
                Engineer

                Priya Nair
                Away
                PM

System Control

          Copy prompt

---

## Tabs

Source: tabs-default.html · Status: Available

Components · Navigation · Tabs
  Back to Tabs types

# Tabs
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
Use for switching between a small set of related views or sections, like settings pages or a product detail's content panes - one Tabs component, controlled by properties, with exactly one tab active at a time.

## Properties

Size, corner radius and labels are properties of the same component, not separate tabs glued together - change them below to check this bar's style and states in the Live Preview. Trigger count follows the number of labels entered.

        Size

        Corner radius

        Labels

        Equal-width tabs

          triggers share the bar's width

        Badge

          count badge on one tab

## Live Preview
    
Both types compared side by side, each in all 6 states - the first tab demonstrates the row's state while the second tab stays the constant active tab and the rest stay neutral. One full matrix is rendered per selected combination of Size and Corner radius. Vertical orientation, per-tab leading icons, and overflow handling (horizontal scroll or a "More" menu) are each a separable, larger feature and aren't built here.

## When to use
    
Any small, fixed set of related views or sections where only one is shown at a time.

      Settings sections
      Product detail views
      Dashboard views
      Account pages

## Component Guide

        Human View
        Machine View

Overview
      
Tabs switch between a small, fixed set of related views or sections with exactly one active at a time - a horizontal row of triggers above the content they control, used when several views belong together but only one needs to be visible at once.

When to Use

- Settings pages split into related sections - Profile, Security, Notifications.
        
- A product detail's content panes - Overview, Specifications, Reviews.
        
- Dashboard or account views sharing the same context - switching between related views without leaving the page.

When Not to Use

- A sequence the user moves through in order, with a clear beginning and end - use Steps instead of Tabs, which implies free switching, not progression.
        
- More views than fit comfortably in a single row - beyond roughly 5-7 tabs, consider a Menu, Dropdown, or a redesigned navigation instead of a horizontally scrolling tab bar.
        
- Views that aren't actually related - unrelated destinations belong in real navigation (a sidebar, a Breadcrumb-backed hierarchy), not a tab set implying siblings.

Best Practices

- Keep tab labels short and parallel in structure (all nouns, or all short phrases) so the row scans easily.
        
- Preserve the active tab across a page reload or back navigation when the URL or state allows it.
        
- Avoid nesting tabs within tabs - it quickly becomes disorienting to track which level is active.

Do and Don't

Do

DetailsActivitySettings
          
A handful of parallel views over the same object, one visibly active, each reachable in a single click.

Don't

OverviewDetailsActivityCommentsHistoryPermissionsBillingIntegrations
          
Eight tabs forces the row to scroll sideways, so most of them are invisible until the user thinks to swipe. Group the overflow into a Menu or a nested page instead.

Accessibility

- Implemented with tab/tabpanel roles, so arrow keys move between tabs and the association between a tab and its panel is explicit.
        
- The active tab is exposed via aria-selected, not communicated by color alone.
        
- Focus moves logically into the panel's content (or stays manageable) when a new tab is activated, rather than getting lost.

Related Components
      
Steps, Menu, Breadcrumb.

{
  "component": "Tabs",
  "category": "Navigation",
  "summary": "Tabs switch between a small, fixed set of related views or sections with exactly one active at a time - a horizontal row of triggers above the content they control, used when several views belong together but only one needs to be visible at once.",
  "whenToUse": [
    "Settings pages split into related sections - Profile, Security, Notifications.",
    "A product detail's content panes - Overview, Specifications, Reviews.",
    "Dashboard or account views sharing the same context - switching between related views without leaving the page."
  ],
  "whenNotToUse": [
    "A sequence the user moves through in order, with a clear beginning and end - use Steps instead of Tabs, which implies free switching, not progression.",
    "More views than fit comfortably in a single row - beyond roughly 5-7 tabs, consider a Menu, Dropdown, or a redesigned navigation instead of a horizontally scrolling tab bar.",
    "Views that aren't actually related - unrelated destinations belong in real navigation (a sidebar, a Breadcrumb-backed hierarchy), not a tab set implying siblings."
  ],
  "bestPractices": [
    "Keep tab labels short and parallel in structure (all nouns, or all short phrases) so the row scans easily.",
    "Preserve the active tab across a page reload or back navigation when the URL or state allows it.",
    "Avoid nesting tabs within tabs - it quickly becomes disorienting to track which level is active."
  ],
  "doAndDont": {
    "do": "A handful of parallel views over the same object, one visibly active, each reachable in a single click.",
    "dont": "Eight tabs forces the row to scroll sideways, so most of them are invisible until the user thinks to swipe. Group the overflow into a Menu or a nested page instead."
  },
  "accessibility": [
    "Implemented with tab/tabpanel roles, so arrow keys move between tabs and the association between a tab and its panel is explicit.",
    "The active tab is exposed via aria-selected, not communicated by color alone.",
    "Focus moves logically into the panel's content (or stays manageable) when a new tab is activated, rather than getting lost."
  ],
  "relatedComponents": [
    "Steps",
    "Menu",
    "Breadcrumb"
  ]
}

---

## Tabs

Source: tabs.html · Status: Available

Components · Navigation

# Tabs
  
A horizontal row of tab triggers used to switch between related views or sections, with exactly one tab active at a time.

## Tabs type

Copy a ready-to-paste AI prompt or the working code - both use this system's own color tokens and Inter, never arbitrary values. Click the card to configure it in full.

            Overview
            Activity
            Settings

Tabs

          Copy prompt

---

## Tag

Source: tag-default.html · Status: Available

Components · Data Display · Tag
  Back to Tag types

# Tag
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
Use for a small labeled chip that categorizes, filters, or flags a status - like "In progress" or an active filter pill - one Tag component, controlled by properties, not a one-off pill built from scratch each time.

## Properties

Corner radius and label text are properties of the same component, not separate chips - change them below to check this tag's colors and forms in the Live Preview.

        Corner radius

        Label

## Live Preview
    
All 4 colors compared side by side, each in all 3 forms - Default, Removable and Selected. One full matrix is rendered per selected Corner radius, with the current label applied throughout.

## Checkable
    
Ant's Tag.CheckableTag - real buttons, click one to toggle it. Unlike a radio group, any number can be on at once; each tag's own aria-pressed state is what "Selected" in the matrix above was only ever a static picture of.

## When to use
    
Any small labeled chip used to categorize, filter, or flag the status of an item.

      Status label
      Category/filter chip
      Selected filter indicator
      Skill/keyword tag
      Priority flag

## Component Guide

        Human View
        Machine View

Overview
      
Tag is a small labeled chip that categorizes, filters, or flags a status - like "In progress" or an active filter pill - a standalone piece of metadata, unlike Badge, which is meant to overlay or sit attached to another element.

When to Use

- A status label - "In progress", "Active", "Archived".
        
- A category or filter chip - showing an applied filter, removable with its own close control.
        
- A skill/keyword tag or a priority flag - any standalone piece of categorical metadata attached to an item.

When Not to Use

- A count or dot overlaid on another element - use Badge instead - Tag stands alone, Badge attaches to something else.
        
- A clickable action rather than a label - use Button - a Tag communicates a static attribute, not an action to take (unless it's specifically a removable filter chip).
        
- Long, multi-word descriptive text - keep Tags short; use Description or plain text for longer explanatory content.

Best Practices

- Use consistent colors for the same status or category everywhere it appears, so users learn the color-meaning mapping.
        
- Keep tag text short - a word or two - so several can sit together without wrapping awkwardly.
        
- Only add a remove ('x') control on tags the user can actually remove (like an active filter), not on static status labels.

Do and Don't

Do

ActiveDraft
          
A one or two-word state name, colour reinforcing the status rather than carrying it alone.

Don't

Last edited 3 days ago by a teammate
          
A full sentence inside a chip fights the pill shape it is rendered in and forces the row to wrap. Move detail like this into body text.

Accessibility

- Status or category meaning is conveyed by text, not color alone, for users with color-vision deficiencies.
        
- A removable tag's close control has an accessible name identifying which tag it removes ("Remove filter: In progress").
        
- Purely informational tags (not removable, not clickable) are marked up as plain text/labels, not interactive controls with no real behavior.

Related Components
      
Badge, Tabs, Group Button.

{
  "component": "Tag",
  "category": "Data Display",
  "summary": "Tag is a small labeled chip that categorizes, filters, or flags a status - like \"In progress\" or an active filter pill - a standalone piece of metadata, unlike Badge, which is meant to overlay or sit attached to another element.",
  "whenToUse": [
    "A status label - \"In progress\", \"Active\", \"Archived\".",
    "A category or filter chip - showing an applied filter, removable with its own close control.",
    "A skill/keyword tag or a priority flag - any standalone piece of categorical metadata attached to an item."
  ],
  "whenNotToUse": [
    "A count or dot overlaid on another element - use Badge instead - Tag stands alone, Badge attaches to something else.",
    "A clickable action rather than a label - use Button - a Tag communicates a static attribute, not an action to take (unless it's specifically a removable filter chip).",
    "Long, multi-word descriptive text - keep Tags short; use Description or plain text for longer explanatory content."
  ],
  "bestPractices": [
    "Use consistent colors for the same status or category everywhere it appears, so users learn the color-meaning mapping.",
    "Keep tag text short - a word or two - so several can sit together without wrapping awkwardly.",
    "Only add a remove ('x') control on tags the user can actually remove (like an active filter), not on static status labels."
  ],
  "doAndDont": {
    "do": "A one or two-word state name, colour reinforcing the status rather than carrying it alone.",
    "dont": "A full sentence inside a chip fights the pill shape it is rendered in and forces the row to wrap. Move detail like this into body text."
  },
  "accessibility": [
    "Status or category meaning is conveyed by text, not color alone, for users with color-vision deficiencies.",
    "A removable tag's close control has an accessible name identifying which tag it removes (\"Remove filter: In progress\").",
    "Purely informational tags (not removable, not clickable) are marked up as plain text/labels, not interactive controls with no real behavior."
  ],
  "relatedComponents": [
    "Badge",
    "Tabs",
    "Group Button"
  ]
}

---

## Tag

Source: tag.html · Status: Available

Components · Data Display

# Tag
  
A small labeled chip for categorizing, filtering, or flagging status, in 4 semantic colors - not a one-off pill built from scratch each time.

## Tag type

Copy a ready-to-paste AI prompt or the working code - both use this system's own color tokens and Inter, never arbitrary values. Click the card to configure it in full.

            Default
            Success
            Warning
            Error

System Control

          Copy prompt

---

## Text Area

Source: text-area-default.html · Status: Available

Components · Forms · Text Area
  Back to Text Area types

# Text Area
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
Use for collecting multiple lines of free-form text, like a comment, a description, or a message.

## Properties

Size, corner radius, label, placeholder and rows are properties of the same component, not separate fields - change them below to check this field's style and states in the Live Preview.

        Size

        Corner radius

        Label

        Placeholder

        Rows
        
          2
          3
          4
          5
          6
          7
          8

        Resizing
        
          Disabled
          Vertical
          Horizontal
          Both

        Allow clear

          × button once filled

        Maximum length

        Character counter

          e.g. 120 / 500

        Required

          shows a required indicator

        Supporting text

          shown below the field

        Supporting text

        Error message

## Live Preview
    
All 3 types compared side by side, each in all 6 states. One full matrix is rendered per selected combination of Size and Corner radius - check more than one option in a dropdown to see every combination side by side.

## When to use
    
Any form field that collects multiple lines of free-form text - comments, feedback, a bio, a description, or a message.

      Comments
      Feedback
      Bio
      Description
      Message

## Validation
    
Text Area's validation is mostly about length - a live counter that warns before it blocks, plus the same required-on-blur handling as any other text field.

- Required marking - mark a required Text Area the same way as any other required field in this system (red asterisk after the label), and validate emptiness on blur or submit, same as Input.
      
- Character counter - show a live, non-error counter ("420 / 500") that only switches to a warning color once the value is near or over the limit. Prefer this over a hard block at the limit: stopping keystrokes outright feels broken to a user who doesn't notice why the field stopped responding, whereas a counter that turns red still lets them see the overage and fix it themselves.
      
- Error message - state the specific shortfall or overage: "Add at least 20 characters" or "You're 40 characters over the limit," never a generic "Invalid input."

## Component Guide

        Human View
        Machine View

Overview
      
Text Area is the multi-line counterpart to Input - a resizable or fixed-height box for collecting free-form text that spans more than one line, like a comment, a bio, or a longer message body.

When to Use

- Any multi-line free-form text - comments, feedback, a bio, a message.
        
- A description field - where the length genuinely varies and a single line would be too cramped.
        
- Content the user is composing rather than briefly answering - a longer note or explanation.

When Not to Use

- A single short line of text - use Input - a Text Area for a name or email adds unnecessary height and visual weight.
        
- A value with an expected fixed format - email, phone, URL - use Input or Add-on so the format can be validated inline.
        
- Text that needs an embedded suggestion or mention picker - use Mention or Autocomplete instead.

Best Practices

- Give it a sensible default height for the expected content length, rather than always starting cramped or oversized.
        
- Show a character counter when there's a maximum length, so users aren't surprised by truncation on submit.
        
- Allow vertical resizing when the content length is unpredictable, so users can expand it themselves.

Do and Don't

Do

Release notes
Fixed the export timeout on large workspaces.
Markdown supported.
          
Sized for the length of answer actually expected, so the user can see what they have written without scrolling a two-line box.

Don't

Postcode
SW1A 1AA
          
A multi-line box for a one-line answer invites line breaks into a value that cannot contain them. Use Input for anything that fits on one line.

Accessibility

- The label is programmatically associated with the textarea, just like Input.
        
- A character limit and remaining-count are announced to assistive technology as the user types, not only shown visually.
        
- Focus state uses a visible outline distinct from the field's default border.

Related Components
      
Input, Mention, Password.

{
  "component": "Text Area",
  "category": "Forms",
  "summary": "Text Area is the multi-line counterpart to Input - a resizable or fixed-height box for collecting free-form text that spans more than one line, like a comment, a bio, or a longer message body.",
  "whenToUse": [
    "Any multi-line free-form text - comments, feedback, a bio, a message.",
    "A description field - where the length genuinely varies and a single line would be too cramped.",
    "Content the user is composing rather than briefly answering - a longer note or explanation."
  ],
  "whenNotToUse": [
    "A single short line of text - use Input - a Text Area for a name or email adds unnecessary height and visual weight.",
    "A value with an expected fixed format - email, phone, URL - use Input or Add-on so the format can be validated inline.",
    "Text that needs an embedded suggestion or mention picker - use Mention or Autocomplete instead."
  ],
  "bestPractices": [
    "Give it a sensible default height for the expected content length, rather than always starting cramped or oversized.",
    "Show a character counter when there's a maximum length, so users aren't surprised by truncation on submit.",
    "Allow vertical resizing when the content length is unpredictable, so users can expand it themselves."
  ],
  "doAndDont": {
    "do": "Sized for the length of answer actually expected, so the user can see what they have written without scrolling a two-line box.",
    "dont": "A multi-line box for a one-line answer invites line breaks into a value that cannot contain them. Use Input for anything that fits on one line."
  },
  "accessibility": [
    "The label is programmatically associated with the textarea, just like Input.",
    "A character limit and remaining-count are announced to assistive technology as the user types, not only shown visually.",
    "Focus state uses a visible outline distinct from the field's default border."
  ],
  "relatedComponents": [
    "Input",
    "Mention",
    "Password"
  ]
}

---

## Text Area

Source: text-area.html · Status: Available

Components · Forms

# Text Area
  
A multi-line free-form text field for longer content, like comments, descriptions, or messages.

## Text Area type

Copy a ready-to-paste AI prompt or the working code - both use this system's own color tokens and Inter, never arbitrary values. Click the card to configure it in full.

            Description

Text Area

          Copy prompt

---

## Time

Source: time-default.html · Status: Available

Components · Forms · Time
  Back to Time types

# Time
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
Use for entering or selecting a single time of day, like a meeting start time, a reminder, or store hours - visually a text field with a fixed trailing clock icon.

## Properties

Size, corner radius, label and placeholder are properties of the same component, not separate fields - change them below to check this field's style and states in the Live Preview.

        Size

        Corner radius

        Label

        Placeholder

        Allow clear

          × replaces icon once filled

        Time format
        
          12-hour (10:30 AM)
          24-hour (10:30)

        Required

          shows a required indicator

        Supporting text

          shown below the field

        Supporting text

        Error message

## Live Preview
    
Both types compared side by side, each in all 9 states. One full matrix is rendered per selected combination of Size and Corner radius - check more than one option in a dropdown to see every combination side by side.

## When to use
    
Any form field that collects a time of day rather than free-form text.

      Meeting start time
      Reminder
      Alarm
      Store hours
      Appointment slot

## Validation
    
Typed time entry can be malformed or simply out of range, and a picker-selected value can still fall outside a business-hours-style limit - both need direct, specific feedback.

- Required marking - mark the field required only when a time value is mandatory to proceed, with the standard label asterisk.
      
- Validation timing - validate typed entry on blur, not on every keystroke, so a partial entry like "9:3" isn't flagged mid-type. A picker-selected value is validated immediately, since the picker only offers valid options.
      
- Invalid time entry - reject an out-of-range or malformed value with a specific message - "Hours must be between 00 and 23," "Minutes must be between 00 and 59," or, for a format mismatch like "930" instead of "9:30," ask for the expected format directly.
      
- Allowed range - if the field is limited to a window (e.g. business hours only), reject a time outside it with a specific message like "Choose a time between 9:00 AM and 5:00 PM," and gray out out-of-range options in the picker itself so most invalid picks are prevented rather than only caught after entry.
      
- Error message - show the message inline next to the field, worded specifically enough that the user knows exactly what to change.

## Component Guide

        Human View
        Machine View

Overview
      
Time is a text field with a fixed trailing clock icon that opens a time picker for selecting a time of day - the temporal counterpart to Date Picker, used whenever the value is a time rather than a calendar date.

When to Use

- A meeting or event start time - any specific time of day.
        
- A reminder or alarm - a time with no associated calendar date.
        
- Store hours or an appointment slot - a time chosen from within a day.

When Not to Use

- A calendar date - use Date Picker.
        
- Both a date and a time together - pair Date Picker and Time as two fields, or use a combined date-time pattern if the product defines one - Time alone doesn't carry a date.
        
- A duration rather than a point in time - e.g. "2 hours" - use Number with a unit label instead.

Best Practices

- Respect the user's locale for 12-hour vs. 24-hour display, rather than hard-coding one format.
        
- Snap the picker to a sensible interval (e.g. 15 minutes) when exact-to-the-second precision isn't meaningful.
        
- Let the user type a time directly as an alternative to scrolling/clicking through the picker.

Do and Don't

Do

Meeting starts
09:30
Your local time (GMT+1).
          
Names the timezone the number is in, which is the only thing that makes a time shared between people actionable.

Don't

Meeting starts
09:30
          
A bare time is ambiguous the moment two people in different places read it, and neither of them will notice until one misses the meeting.

Accessibility

- The time picker is fully keyboard-operable (arrow keys or typing to adjust hour/minute, Enter to confirm).
        
- The field's accessible name states what the time represents ("Meeting start time"), not just "Time".
        
- AM/PM (in 12-hour format) is exposed as its own clearly labeled control, not bundled invisibly into the hour value.

Related Components
      
Date Picker, Date Range, Number.

{
  "component": "Time",
  "category": "Forms",
  "summary": "Time is a text field with a fixed trailing clock icon that opens a time picker for selecting a time of day - the temporal counterpart to Date Picker, used whenever the value is a time rather than a calendar date.",
  "whenToUse": [
    "A meeting or event start time - any specific time of day.",
    "A reminder or alarm - a time with no associated calendar date.",
    "Store hours or an appointment slot - a time chosen from within a day."
  ],
  "whenNotToUse": [
    "A calendar date - use Date Picker.",
    "Both a date and a time together - pair Date Picker and Time as two fields, or use a combined date-time pattern if the product defines one - Time alone doesn't carry a date.",
    "A duration rather than a point in time - e.g. \"2 hours\" - use Number with a unit label instead."
  ],
  "bestPractices": [
    "Respect the user's locale for 12-hour vs. 24-hour display, rather than hard-coding one format.",
    "Snap the picker to a sensible interval (e.g. 15 minutes) when exact-to-the-second precision isn't meaningful.",
    "Let the user type a time directly as an alternative to scrolling/clicking through the picker."
  ],
  "doAndDont": {
    "do": "Names the timezone the number is in, which is the only thing that makes a time shared between people actionable.",
    "dont": "A bare time is ambiguous the moment two people in different places read it, and neither of them will notice until one misses the meeting."
  },
  "accessibility": [
    "The time picker is fully keyboard-operable (arrow keys or typing to adjust hour/minute, Enter to confirm).",
    "The field's accessible name states what the time represents (\"Meeting start time\"), not just \"Time\".",
    "AM/PM (in 12-hour format) is exposed as its own clearly labeled control, not bundled invisibly into the hour value."
  ],
  "relatedComponents": [
    "Date Picker",
    "Date Range",
    "Number"
  ]
}

---

## Time

Source: time.html · Status: Available

Components · Forms

# Time
  
A form control for entering or selecting a time of day, like a meeting start time or a reminder - a text field with a fixed trailing clock icon, in Outlined and Filled styles across six states.

## Time type

Copy a ready-to-paste AI prompt or the working code - both use this system's own color tokens and Inter, never arbitrary values. Click the card to configure it in full.

            Meeting time

              10:30 AM

Time

          Copy prompt

---

## Timeline

Source: timeline-default.html · Status: Available

Components · Data Display · Timeline
  Back to Timeline types

# Timeline
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
Use to show a sequence of events in chronological order, each with a dot connected by a continuous line - one Timeline component, controlled by properties, for activity logs, order status history, or a project's milestone history.

## Properties

Show icons swaps the plain dot markers for small colored status icons across every event. Change it below to check both layouts and every state in the Live Preview.

        Show icons

          small status icons instead of dots

## Live Preview
    
Both layouts compared side by side, each in all 3 states - Default, With events and Pending. One matrix is rendered at the chosen Show icons setting.

## When to use
    
Any place a sequence of events needs to read clearly in chronological order, with a sense of what's done, current, and still to come.

      Order status history
      Activity/audit log
      Project milestone tracker
      Onboarding progress
      Support ticket history

## Component Guide

        Human View
        Machine View

Overview
      
Timeline shows a sequence of events in chronological order, each with a dot connected by a continuous line - used for activity logs, order status history, or a project's milestone history, so the reader can see what happened, when, and in what order.

When to Use

- Order status history - showing each stage a shipment or order has passed through.
        
- An activity or audit log - chronological events tied to a record.
        
- Project milestone tracking or onboarding progress - a sequence of events, each with a point in time.

When Not to Use

- A fixed sequence the user is actively moving through right now - use Steps instead - Timeline is a historical record, Steps is an in-progress flow.
        
- Unordered or non-chronological content - a Timeline's core value is chronological order; don't use it for a list with no meaningful sequence.
        
- A simple list with no time dimension at all - use List.

Best Practices

- Keep each entry's timestamp visible and consistently formatted, since chronology is the whole point of a Timeline.
        
- Use distinct icons or colors sparingly, reserved for genuinely different event types, not decoration.
        
- For very long histories, consider collapsing older entries or paginating rather than rendering the entire history at once.

Do and Don't

Do

Order shipped
14 Mar, 09:12

Out for delivery
Expected 16 Mar
          
Events in chronological order, each with a timestamp, so the sequence and its pacing are both readable.

Don't

Out for delivery

Order shipped
          
Events out of order with no timestamps leave the reader unable to tell what actually happened when - the one thing a timeline exists to show.

Accessibility

- Each entry's timestamp and description are real text, read in order by screen readers, not implied only by visual position on the line.
        
- The connecting line and dots are decorative and hidden from assistive technology - the meaningful content is the entry text itself.
        
- Event type (success, error, pending) is distinguishable by more than color, using an icon or text label as well.

Related Components
      
Steps, List, Result.

{
  "component": "Timeline",
  "category": "Data Display",
  "summary": "Timeline shows a sequence of events in chronological order, each with a dot connected by a continuous line - used for activity logs, order status history, or a project's milestone history, so the reader can see what happened, when, and in what order.",
  "whenToUse": [
    "Order status history - showing each stage a shipment or order has passed through.",
    "An activity or audit log - chronological events tied to a record.",
    "Project milestone tracking or onboarding progress - a sequence of events, each with a point in time."
  ],
  "whenNotToUse": [
    "A fixed sequence the user is actively moving through right now - use Steps instead - Timeline is a historical record, Steps is an in-progress flow.",
    "Unordered or non-chronological content - a Timeline's core value is chronological order; don't use it for a list with no meaningful sequence.",
    "A simple list with no time dimension at all - use List."
  ],
  "bestPractices": [
    "Keep each entry's timestamp visible and consistently formatted, since chronology is the whole point of a Timeline.",
    "Use distinct icons or colors sparingly, reserved for genuinely different event types, not decoration.",
    "For very long histories, consider collapsing older entries or paginating rather than rendering the entire history at once."
  ],
  "doAndDont": {
    "do": "Events in chronological order, each with a timestamp, so the sequence and its pacing are both readable.",
    "dont": "Events out of order with no timestamps leave the reader unable to tell what actually happened when - the one thing a timeline exists to show."
  },
  "accessibility": [
    "Each entry's timestamp and description are real text, read in order by screen readers, not implied only by visual position on the line.",
    "The connecting line and dots are decorative and hidden from assistive technology - the meaningful content is the entry text itself.",
    "Event type (success, error, pending) is distinguishable by more than color, using an icon or text label as well."
  ],
  "relatedComponents": [
    "Steps",
    "List",
    "Result"
  ]
}

---

## Timeline

Source: timeline.html · Status: Available

Components · Data Display

# Timeline
  
A vertical chronological list of events, each with a small dot connected by a continuous line, used for activity logs, order status history, or a project's milestone history.

## Timeline type

Copy a ready-to-paste AI prompt or the working code - both use this system's own color tokens and Inter, never arbitrary values. Click the card to configure it in full.

Order placed
                
Sep 10, 9:02 AM

Payment confirmed
                
Sep 10, 9:05 AM

Shipped
                
Sep 11, 2:30 PM

System Control

          Copy prompt

---

## Toast

Source: toast-default.html · Status: Available

Components · Feedback · Toast
  Back to Toast types

# Toast
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
Use for a temporary, floating confirmation of an action or status change, typically surfaced in a fixed screen corner (e.g. bottom-right) rather than embedded inline like Alert - one Toast component, controlled by properties, not separate cards glued together.

## Properties

Corner radius, title, description, icon and action label are properties of the same component, not separate cards - change them below to check this toast's style and scenarios in the Live Preview. Dismissible, With action, With progress and Loading aren't separate properties here since they're not mutually exclusive states - pick any row by name from the Live Preview's own State selector to see that combination.

        Corner radius

        Title

        Heading level
        
          H1
          H2
          H3
          H4
          H5
          H6

        Description

        Action label

        Show title

          title text shown

        Show description

          description text shown

        Show icon

          shown beside the title

## Live Preview
    
All 4 types compared side by side, each across 6 representative scenarios - Default, Dismissible, With action, With progress, Dismissible + Action + Progress (proving they combine), and Loading. One full matrix is rendered per selected Corner radius, using the chosen title, description, icon and action-label settings.

## When to use
    
A temporary, floating confirmation of an action or a status change that doesn't require the user to stay on the page to see it resolve.

      Upload confirmation
      Action undo prompt
      Background job complete
      Copy-to-clipboard confirmation
      Connection status change

## Component Guide

        Human View
        Machine View

Overview
      
Toast is a temporary, floating confirmation of an action or status change, typically surfaced in a fixed screen corner rather than embedded inline like Alert - it appears, communicates its message, and disappears on its own without requiring the user to stay put.

When to Use

- A brief confirmation after an action - upload complete, copy-to-clipboard confirmation.
        
- An undo prompt - a short window to reverse the action just taken.
        
- A background job completing or a connection status change - events the user doesn't need to actively wait for.

When Not to Use

- A message that needs to stay visible until manually dismissed or resolved - use Alert, which is embedded and persistent, not self-dismissing.
        
- Anything requiring a decision before the user can continue - use Modal or Pop Confirm - a self-dismissing Toast is the wrong place for a choice with consequences.
        
- Detailed or long-form content - use Notification, which is built for a longer title/description pairing.

Best Practices

- Keep the message short enough to read in the few seconds before it disappears.
        
- Stack multiple toasts rather than replacing one before the user has had a chance to read it.
        
- Give an undo action a genuinely sufficient window before the toast dismisses, if undo is offered at all.

Do and Don't

Do

Draft saved
          
Short enough to read in the couple of seconds it is on screen, confirming something the user just did.

Don't

Delete this workspace?
This removes all 240 files permanently.
          
A decision inside a toast can vanish before it is answered. Anything with consequences belongs in a Modal or Pop Confirm.

Accessibility

- Announced via an aria-live region so screen-reader users are told about it without needing to be focused on it.
        
- Long enough on-screen duration (or a pause-on-hover/focus behavior) so it doesn't disappear before it can be read or acted on.
        
- Any inline action (like Undo) is a real, independently focusable control.

Related Components
      
Alert, Notification, Result.

{
  "component": "Toast",
  "category": "Feedback",
  "summary": "Toast is a temporary, floating confirmation of an action or status change, typically surfaced in a fixed screen corner rather than embedded inline like Alert - it appears, communicates its message, and disappears on its own without requiring the user to stay put.",
  "whenToUse": [
    "A brief confirmation after an action - upload complete, copy-to-clipboard confirmation.",
    "An undo prompt - a short window to reverse the action just taken.",
    "A background job completing or a connection status change - events the user doesn't need to actively wait for."
  ],
  "whenNotToUse": [
    "A message that needs to stay visible until manually dismissed or resolved - use Alert, which is embedded and persistent, not self-dismissing.",
    "Anything requiring a decision before the user can continue - use Modal or Pop Confirm - a self-dismissing Toast is the wrong place for a choice with consequences.",
    "Detailed or long-form content - use Notification, which is built for a longer title/description pairing."
  ],
  "bestPractices": [
    "Keep the message short enough to read in the few seconds before it disappears.",
    "Stack multiple toasts rather than replacing one before the user has had a chance to read it.",
    "Give an undo action a genuinely sufficient window before the toast dismisses, if undo is offered at all."
  ],
  "doAndDont": {
    "do": "Short enough to read in the couple of seconds it is on screen, confirming something the user just did.",
    "dont": "A decision inside a toast can vanish before it is answered. Anything with consequences belongs in a Modal or Pop Confirm."
  },
  "accessibility": [
    "Announced via an aria-live region so screen-reader users are told about it without needing to be focused on it.",
    "Long enough on-screen duration (or a pause-on-hover/focus behavior) so it doesn't disappear before it can be read or acted on.",
    "Any inline action (like Undo) is a real, independently focusable control."
  ],
  "relatedComponents": [
    "Alert",
    "Notification",
    "Result"
  ]
}

---

## Toast

Source: toast.html · Status: Available

Components · Feedback

# Toast
  
A floating, elevated notification that appears temporarily to confirm an action or report a status - unlike Alert, which sits inline in page content, Toast surfaces above the page itself, the way a real notification appears in a corner of the screen after an action completes.

## Toast type

Copy a ready-to-paste AI prompt or the working code - both use this system's own color tokens and Inter, never arbitrary values. Click the card to configure it in full.

Upload complete
              
your-file.pdf was uploaded successfully.

System Control

          Copy prompt

---

## Tooltip

Source: tooltip-default.html · Status: Available

Components · Feedback · Tooltip
  Back to Tooltip types

# Tooltip
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
Use to add a short hint next to a trigger element, like an icon-only button, without needing to click anything - one Tooltip component, controlled by properties, not a one-off floating label built from scratch each time.

## Properties

Size, text content and the arrow are properties of the same component, not separate tooltips built by hand - change them below to check every placement and content state in the Live Preview.

        Size
        
          Small
          Default
          Large

        Text content

        Show arrow

          pointing at the trigger

## Live Preview
    
All 4 placements compared side by side, each in 3 content states - Plain text, Rich (title + description) and Long text that wraps. One matrix is rendered at the chosen Size, Text content and Show arrow setting.

## When to use
    
Any short hint that clarifies a control without needing a click, especially where visible labels don't fit.

      Icon-only button label
      Truncated text disclosure
      Form field hint
      Keyboard shortcut hint
      Disabled-control explanation

## Component Guide

        Human View
        Machine View

Overview
      
Tooltip adds a short hint next to a trigger element, like an icon-only button, without needing to click anything - a small floating label that appears on hover or focus and disappears when attention moves elsewhere.

When to Use

- Labeling an icon-only control - explaining what an unlabeled icon button does.
        
- Disclosing truncated text - showing the full value of text cut off with an ellipsis.
        
- A keyboard shortcut hint or a brief explanation for a disabled control - why an action currently can't be taken.

When Not to Use

- Essential information the user must see to complete a task - hover-only content is easy to miss, especially on touch devices; put critical information visibly on screen instead.
        
- Long or multi-paragraph content - use Popover, which supports richer content and stays open until dismissed.
        
- Content that needs to remain visible while the user interacts with it - a tooltip disappears when hover/focus moves away, so it can't hold interactive controls of its own.

Best Practices

- Keep the text to a single short phrase or sentence - if it needs more, use Popover instead.
        
- Trigger it on both hover and keyboard focus, never hover alone, so keyboard users get the same information.
        
- Avoid delaying its appearance so long that it feels unresponsive, or so little that it flickers on incidental mouse movement.

Do and Don't

Do

Archive

□
          
Supplies the name of an icon-only control - exactly the gap a tooltip exists to fill.

Don't

Required. Must be 8+ characters with a number and a symbol.

□
          
Rules the user needs while typing should not be hidden behind hover - they are invisible on touch and gone the moment the pointer moves. Put them in the field's help text.

Accessibility

- Associated with its trigger via aria-describedby pointing at the tooltip bubble's id, so screen readers announce it as supplementary information about the focused control, not as an unrelated interruption.
        
- Appears on keyboard focus, not just mouse hover - the trigger must be focusable (tabindex="0" if it isn't natively) so keyboard-only users get exactly the same hint sighted mouse users do.
        
- Deliberately carries no aria-live/role="alert"/role="status": Tooltip is this system's lowest interruption level, a supplementary hint tied to whatever already has focus, not an event that needs to interrupt and announce itself elsewhere on the page.
        
- Never the only source of essential information - it must supplement, not replace, a visible accessible name.

Related Components
      
Popover, Pop Confirm, Tour.

{
  "component": "Tooltip",
  "category": "Feedback",
  "summary": "Tooltip adds a short hint next to a trigger element, like an icon-only button, without needing to click anything - a small floating label that appears on hover or focus and disappears when attention moves elsewhere.",
  "whenToUse": [
    "Labeling an icon-only control - explaining what an unlabeled icon button does.",
    "Disclosing truncated text - showing the full value of text cut off with an ellipsis.",
    "A keyboard shortcut hint or a brief explanation for a disabled control - why an action currently can't be taken."
  ],
  "whenNotToUse": [
    "Essential information the user must see to complete a task - hover-only content is easy to miss, especially on touch devices; put critical information visibly on screen instead.",
    "Long or multi-paragraph content - use Popover, which supports richer content and stays open until dismissed.",
    "Content that needs to remain visible while the user interacts with it - a tooltip disappears when hover/focus moves away, so it can't hold interactive controls of its own."
  ],
  "bestPractices": [
    "Keep the text to a single short phrase or sentence - if it needs more, use Popover instead.",
    "Trigger it on both hover and keyboard focus, never hover alone, so keyboard users get the same information.",
    "Avoid delaying its appearance so long that it feels unresponsive, or so little that it flickers on incidental mouse movement."
  ],
  "doAndDont": {
    "do": "Supplies the name of an icon-only control - exactly the gap a tooltip exists to fill.",
    "dont": "Rules the user needs while typing should not be hidden behind hover - they are invisible on touch and gone the moment the pointer moves. Put them in the field's help text."
  },
  "accessibility": [
    "Associated with its trigger via aria-describedby pointing at the tooltip bubble's id, so screen readers announce it as supplementary information about the focused control, not as an unrelated interruption.",
    "Appears on keyboard focus, not just mouse hover - the trigger must be focusable (tabindex=\"0\" if it isn't natively) so keyboard-only users get exactly the same hint sighted mouse users do.",
    "Deliberately carries no aria-live/role=\"alert\"/role=\"status\": Tooltip is this system's lowest interruption level, a supplementary hint tied to whatever already has focus, not an event that needs to interrupt and announce itself elsewhere on the page.",
    "Never the only source of essential information - it must supplement, not replace, a visible accessible name."
  ],
  "relatedComponents": [
    "Popover",
    "Pop Confirm",
    "Tour"
  ]
}

---

## Tooltip

Source: tooltip.html · Status: Available

Components · Feedback

# Tooltip
  
A small floating label anchored to a trigger element, giving a short hint without needing to click anything.

## Tooltip type

Copy a ready-to-paste AI prompt or the working code - both use this system's own color tokens and Inter, never arbitrary values. Click the card to configure it in full.

Add to favorites

            ?

System Control

          Copy prompt

---

## Tour

Source: tour-default.html · Status: Available

Components · Feedback · Tour
  Back to Tour types

# Tour
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
Use to guide a new user through a sequence of features one at a time - a small card anchored next to a highlighted UI element, with Back/Next navigation and a step counter - one Tour component, controlled by properties, not a one-off walkthrough built from scratch each time.

## Properties

Target label, title and description are properties of the same component, not separate tours built by hand - change them below to check every placement and step-position state in the Live Preview.

        Target label

        Title

        Heading level
        
          H1
          H2
          H3
          H4
          H5
          H6

        Description

## Live Preview
    
All 4 placements compared side by side, each in 3 step-position states - First step (Next only), Middle step (Back and Next) and Last step (Back and Finish). One matrix is rendered at the chosen Target label, Title and Description setting.

## When to use
    
Any sequence of features a new user should be walked through one at a time, rather than left to discover on their own.

      New user onboarding
      Feature announcement walkthrough
      Multi-step setup guide
      Contextual help sequence
      Release highlight tour

## Component Guide

        Human View
        Machine View

Overview
      
Tour guides a new user through a sequence of features one at a time - a small card anchored next to a highlighted UI element, with Back/Next navigation and a step counter, used to walk someone through unfamiliar functionality rather than leaving them to discover it alone.

When to Use

- First-time onboarding through key features - a guided walkthrough for new users.
        
- A feature-announcement walkthrough - introducing something new to existing users.
        
- A multi-step setup guide or contextual help sequence - anchored to the actual UI elements involved.

When Not to Use

- A single, standalone hint about one control - use Tooltip instead of a full multi-step tour.
        
- Reference material a user might want to revisit anytime - use static Documentation or a help panel rather than a one-time guided sequence.
        
- Frequent or repeated interruptions for returning users - a Tour should typically run once (or be easily dismissed permanently), not repeatedly block the same user.

Best Practices

- Keep the sequence short - a handful of steps at most, focused on genuinely non-obvious functionality.
        
- Always let the user skip or exit the tour at any step, not just at the end.
        
- Anchor each step precisely to the real UI element it describes, so the highlighted target and the explanation clearly match.

Do and Don't

Do

Step 2 of 3
Filters live here
Narrow long lists without leaving the page.
          
A short sequence with the position shown, so the user knows how much is left before they commit.

Don't

Step 9 of 14
This is the Save button
Click Save to save.
          
Fourteen steps explaining self-evident controls gets dismissed, taking the genuinely useful steps with it.

Accessibility

- Each step's card is exposed as role="dialog" (like Modal, but non-blocking of the rest of the page: aria-modal="false") with an accessible name and description via aria-labelledby/aria-describedby.
        
- Focus moves into each step's card as it appears - the same per-step focus management Modal uses on open - so keyboard and screen-reader users follow the same sequence as everyone else, then moves on again as the step advances.
        
- Each step is reachable and dismissible by keyboard (Back/Next/Escape), not only by mouse click, and a Skip/Exit control is always keyboard-reachable, not just a small close icon meant for a mouse.
        
- The step count and current position ("Step 2 of 4") are exposed as text content read with the step, not conveyed only by a visual progress dot - and no separate aria-live region is used, since each step's arrival is already announced by focus moving to its dialog.

Related Components
      
Tooltip, Popover, Steps.

{
  "component": "Tour",
  "category": "Feedback",
  "summary": "Tour guides a new user through a sequence of features one at a time - a small card anchored next to a highlighted UI element, with Back/Next navigation and a step counter, used to walk someone through unfamiliar functionality rather than leaving them to discover it alone.",
  "whenToUse": [
    "First-time onboarding through key features - a guided walkthrough for new users.",
    "A feature-announcement walkthrough - introducing something new to existing users.",
    "A multi-step setup guide or contextual help sequence - anchored to the actual UI elements involved."
  ],
  "whenNotToUse": [
    "A single, standalone hint about one control - use Tooltip instead of a full multi-step tour.",
    "Reference material a user might want to revisit anytime - use static Documentation or a help panel rather than a one-time guided sequence.",
    "Frequent or repeated interruptions for returning users - a Tour should typically run once (or be easily dismissed permanently), not repeatedly block the same user."
  ],
  "bestPractices": [
    "Keep the sequence short - a handful of steps at most, focused on genuinely non-obvious functionality.",
    "Always let the user skip or exit the tour at any step, not just at the end.",
    "Anchor each step precisely to the real UI element it describes, so the highlighted target and the explanation clearly match."
  ],
  "doAndDont": {
    "do": "A short sequence with the position shown, so the user knows how much is left before they commit.",
    "dont": "Fourteen steps explaining self-evident controls gets dismissed, taking the genuinely useful steps with it."
  },
  "accessibility": [
    "Each step's card is exposed as role=\"dialog\" (like Modal, but non-blocking of the rest of the page: aria-modal=\"false\") with an accessible name and description via aria-labelledby/aria-describedby.",
    "Focus moves into each step's card as it appears - the same per-step focus management Modal uses on open - so keyboard and screen-reader users follow the same sequence as everyone else, then moves on again as the step advances.",
    "Each step is reachable and dismissible by keyboard (Back/Next/Escape), not only by mouse click, and a Skip/Exit control is always keyboard-reachable, not just a small close icon meant for a mouse.",
    "The step count and current position (\"Step 2 of 4\") are exposed as text content read with the step, not conveyed only by a visual progress dot - and no separate aria-live region is used, since each step's arrival is already announced by focus moving to its dialog."
  ],
  "relatedComponents": [
    "Tooltip",
    "Popover",
    "Steps"
  ]
}

---

## Tour

Source: tour.html · Status: Available

Components · Feedback

# Tour
  
A step-by-step walkthrough overlay that highlights one UI element at a time with a title, description and Back/Next navigation, guiding a new user through a feature sequence.

## Tour type

Copy a ready-to-paste AI prompt or the working code - both use this system's own color tokens and Inter, never arbitrary values. Click the card to configure it in full.

1 of 3
              
Try the new dashboard
              
Get a quick overview of your team's activity in one place.

                Next

            New feature

System Control

          Copy prompt

---

## Transfer

Source: transfer-default.html · Status: Available

Components · Forms · Transfer
  Back to Transfer types

# Transfer
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
Use for choosing a subset of items from a larger pool - two side-by-side list panels with checkboxes, moved between with center arrow buttons, when a multi-select dropdown would be too cramped to compare both sides at once.

## Properties

Size, and the left/right panel titles are properties of the same component, not two unrelated lists - change them below to check this widget's style and states in the Live Preview.

        Size
        
          Small
          Default
          Large

        Left title

        Right title

## Live Preview
    
Both types compared side by side, each in all 8 states - Hover shows a static hover background on the first source item, Focus shows a focus ring on the right-arrow button, Loading/Empty/No Results replace each panel's rows with a contextual message, Error shows a retry banner above the panels, and Disabled dims the whole widget. One matrix is rendered at the chosen Size, with the panel titles shown as configured above.

## When to use
    
Any time a user needs to pick a subset of items out of a larger pool, and seeing both the available and chosen items side by side helps them decide.

      Permission assignment
      Playlist builder
      Team member picker
      Column visibility chooser
      Tag selector

## Validation
    
Both panels are always visibly populated - the left panel starts full of options - so a required Transfer isn't about the widget looking "empty," it's specifically about nothing having been moved into the right/target panel yet.

- Required marking - place the red asterisk on the target panel's own title ("Granted *"), not on the widget as a whole, since that's the panel whose emptiness actually matters.
      
- Validation timing - validate on submit - there's no meaningful blur point for a widget built around repeated multi-item moves, and flagging it after every single move would fire while the user is still mid-selection.
      
- Error message - "Move at least one item to the right to continue," not "This field is required" - name the action (move an item) and the direction, since the source panel being full can otherwise read as the field already being satisfied.
      
- Recovery - anchor the error under the target panel's header and clear it the moment an item lands there, so the fix is visibly tied to the panel that caused it.

## Component Guide

        Human View
        Machine View

Overview
      
Transfer shows two side-by-side list panels with checkboxes, moved between with center arrow buttons - used for choosing a subset of items from a larger pool when seeing both the available and chosen items at once helps the user decide, unlike a multi-select dropdown that hides one side.

When to Use

- Permission or role assignment - moving specific permissions into an assigned list.
        
- Building a subset from a larger pool - a playlist builder, a team member picker.
        
- Choosing visible columns or tags - column visibility chooser, a tag selector.

When Not to Use

- A single value chosen from a list - use Select - Transfer is for choosing several items, not one.
        
- A small option set - a handful of items rarely justifies two full panels; use Checkbox group instead.
        
- Hierarchical, nested data - use Tree Select so the structure itself stays visible, rather than flattening it into two plain lists.

Best Practices

- Support search/filter within each panel once the pool of items grows beyond a quick scan.
        
- Show a live count of selected items in each panel's header.
        
- Keep the moved-to panel's order meaningful (e.g. order added) rather than silently re-sorting it.

Do and Don't

Do

Available (2)
BillingReports
›‹

Granted (1)
Admin
          
Both sides named for what membership means, with counts, so the user can see the result of the move without counting rows.

Don't

List A
Billing
›‹

List B
Admin
          
"List A" and "List B" never say which side is the one that takes effect, so moving an item is a guess.

Accessibility

- Each row's checkbox is independently focusable and labeled with the item's name.
        
- The arrow buttons that move items between panels have accessible names ("Move selected to chosen"), not just an arrow glyph.
        
- Moving items announces the change (e.g. via an aria-live region) so screen-reader users know the panels updated.

Related Components
      
Checkbox, Tree Select, Select.

{
  "component": "Transfer",
  "category": "Forms",
  "summary": "Transfer shows two side-by-side list panels with checkboxes, moved between with center arrow buttons - used for choosing a subset of items from a larger pool when seeing both the available and chosen items at once helps the user decide, unlike a multi-select dropdown that hides one side.",
  "whenToUse": [
    "Permission or role assignment - moving specific permissions into an assigned list.",
    "Building a subset from a larger pool - a playlist builder, a team member picker.",
    "Choosing visible columns or tags - column visibility chooser, a tag selector."
  ],
  "whenNotToUse": [
    "A single value chosen from a list - use Select - Transfer is for choosing several items, not one.",
    "A small option set - a handful of items rarely justifies two full panels; use Checkbox group instead.",
    "Hierarchical, nested data - use Tree Select so the structure itself stays visible, rather than flattening it into two plain lists."
  ],
  "bestPractices": [
    "Support search/filter within each panel once the pool of items grows beyond a quick scan.",
    "Show a live count of selected items in each panel's header.",
    "Keep the moved-to panel's order meaningful (e.g. order added) rather than silently re-sorting it."
  ],
  "doAndDont": {
    "do": "Both sides named for what membership means, with counts, so the user can see the result of the move without counting rows.",
    "dont": "\"List A\" and \"List B\" never say which side is the one that takes effect, so moving an item is a guess."
  },
  "accessibility": [
    "Each row's checkbox is independently focusable and labeled with the item's name.",
    "The arrow buttons that move items between panels have accessible names (\"Move selected to chosen\"), not just an arrow glyph.",
    "Moving items announces the change (e.g. via an aria-live region) so screen-reader users know the panels updated."
  ],
  "relatedComponents": [
    "Checkbox",
    "Tree Select",
    "Select"
  ]
}

---

## Transfer

Source: transfer.html · Status: Available

Components · Forms

# Transfer
  
A dual-list widget for choosing a subset of items - move entries from an available-items list on the left into a chosen-items list on the right using the transfer arrow buttons between them.

## Transfer type

Copy a ready-to-paste AI prompt or the working code - both use this system's own color tokens and Inter, never arbitrary values. Click the card to configure it in full.

Source1/3

                Alice
                Bob
                Carol

              >
              <

Target2 items

                Eve
                Frank

System Control

          Copy prompt

---

## Tree Experimental

Source: tree-default.html · Status: Available

Components · Data Display · Tree
  Back to Tree types

# Tree Experimental
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
Use for a standalone, always-visible hierarchical structure with expandable branches, like a file system or an org chart - one Tree component, controlled by properties, not a one-off nested list rebuilt per screen. Distinct from Tree Select, which is the same structure behind a Select-style dropdown trigger.

## Properties

Root label and icon visibility are properties of the same component, not a separate tree - change them below to check all 3 types and every state in the Live Preview. The node structure itself (Reports/Presentations/Notes.txt) is fixed reference content, matching Cascader's and Tree Select's own fixed demo hierarchies.

        Root label

        Show icons

          folder/file icon next to each node

## Live Preview
    
All 3 types compared side by side, each in 4 states - Default (collapsed), Expanded (Reports open), Selected (Q1 Report.pdf highlighted or checked) and Disabled. One preview is rendered at the chosen Root label and icon visibility.

## Try it
    
The matrix above renders each state fixed, so all four can be compared at once. This one is live: expand and collapse branches, and check nodes to watch the selection cascade down to children and roll up into indeterminate parents.

## When to use
    
Any hierarchical, nested structure the user needs to browse, expand, or select nodes from directly on the page.

      File/folder browser
      Org chart
      Category tree
      Permission tree with checkboxes
      Nested settings navigation

## Component Guide

        Human View
        Machine View

Overview
      
Tree is a standalone, always-visible hierarchical structure with expandable branches - each node can be a folder-like parent with children or a leaf, optionally with a checkbox for multi-select. It's the always-on-page counterpart to Tree Select, which hides the same structure behind a dropdown trigger.

When to Use

- A file or folder browser - nested files and directories the user expands and browses directly.
        
- An org chart or category tree - a structure worth keeping visible while the user works, not hidden behind a click.
        
- A permission tree with checkboxes - selecting individual nodes or whole branches at once.

When Not to Use

- A form field that picks one value from hierarchical data - use Tree Select so the structure stays hidden until needed, saving space.
        
- Linked columns where each choice narrows the next - use Cascader instead of a single expandable tree.
        
- Flat, non-hierarchical data - use List or Table; a Tree's indentation and expand controls add nothing when there's no real nesting.

Best Practices

- Keep deeply nested branches collapsed by default, expanding only the path relevant to the current context.
        
- Use the Checkable type's parent-checkbox to reflect a partial (indeterminate) selection when only some children are checked.
        
- Pair folder/file icons with the indentation, not instead of it - icons alone don't communicate depth as clearly as indentation does.
        
- Reach for the Metatext type's second line of supplemental text to disambiguate similarly-named nodes or surface a quick detail (a file size, an item count) without adding a column.

Do and Don't

Do

▾📁Design

📄Icons.fig
          
Folders and files read differently at a glance, and the hierarchy is shown through real indentation, not just a label prefix.

Don't

Design
- Icons.fig
          
A hyphen standing in for indentation collapses the moment there is more than one level deep, and gives folders no toggle to collapse their contents.

Accessibility

- Implemented with tree/treeitem roles, so screen readers announce each node's depth and expanded/collapsed state.
        
- Fully keyboard-operable - arrow keys move between nodes, and left/right expand or collapse a branch.
        
- Checkbox state (checked/indeterminate/unchecked) is exposed programmatically, not communicated by fill color alone.

Related Components
      
Tree Select, Cascader, Transfer.

{
  "component": "Tree",
  "status": "Experimental",
  "category": "Data Display",
  "summary": "Tree is a standalone, always-visible hierarchical structure with expandable branches - the always-on-page counterpart to Tree Select's dropdown-hidden variant.",
  "whenToUse": [
    "A file or folder browser with nested files and directories.",
    "An org chart or category tree worth keeping visible while the user works.",
    "A permission tree with checkboxes for selecting individual nodes or whole branches."
  ],
  "whenNotToUse": [
    "A form field that picks one value from hierarchical data - use Tree Select instead.",
    "Linked columns where each choice narrows the next - use Cascader instead.",
    "Flat, non-hierarchical data - use List or Table instead."
  ],
  "bestPractices": [
    "Keep deeply nested branches collapsed by default, expanding only the relevant path.",
    "Use the Checkable type's parent-checkbox to reflect a partial (indeterminate) selection.",
    "Pair folder/file icons with indentation, not instead of it.",
    "Reach for the Metatext type's second line of supplemental text to disambiguate similarly-named nodes or surface a quick detail without adding a column."
  ],
  "doAndDont": {
    "do": "Folders and files read differently at a glance, and the hierarchy is shown through real indentation, not just a label prefix.",
    "dont": "A hyphen standing in for indentation collapses the moment there is more than one level deep, and gives folders no toggle to collapse their contents."
  },
  "accessibility": [
    "Implemented with tree/treeitem roles announcing depth and expanded state.",
    "Fully keyboard-operable - arrow keys move between nodes, left/right expand or collapse.",
    "Checkbox state is exposed programmatically, not communicated by color alone."
  ],
  "relatedComponents": [
    "Tree Select",
    "Cascader",
    "Transfer"
  ]
}

---

## Tree Select

Source: tree-select-default.html · Status: Available

Components · Forms · Tree Select
  Back to Tree Select types

# Tree Select
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
Use for a select field over hierarchical, nested data - like an org chart or a folder structure - where the user can pick any node, parent or leaf, at any depth from an indented, expandable tree.

## Properties

Size, corner radius, label and placeholder are properties of the same component, not separate fields - change them below to check this field's style and states in the Live Preview.

        Size

        Corner radius

        Label

        Placeholder

        Allow clear

          × replaces chevron once filled

        Required

          shows a required indicator

        Supporting text

          shown below the field

        Supporting text

        Error message

## Live Preview
    
Both types compared side by side, each in all 10 states. One full matrix is rendered per selected combination of Size and Corner radius - check more than one option in a dropdown to see every combination side by side.

## Multiple selection + Search
    
Two documented Ant TreeSelect features the matrix above can't show, since it's single-select with no search: typing narrows the tree to matching nodes (highlighted inline, ancestors kept visible for context), and a checkbox per node - parents included - lets more than one node be picked across different branches at once.

## When to use
    
Any form field that needs to pick a single node from hierarchical, nested data, where the option set is too deep or too structured for a flat Select or Cascader's linked columns.

      Org chart picker
      Folder/category picker
      Permission group assignment
      Nested tag selector
      Report hierarchy filter

## Validation
    
In checkbox mode, a parent node can show an indeterminate mark purely because some of its children are checked, without the parent itself being a selected value - required validation needs to look past that indeterminate state to whether any concrete node is actually checked.

- Required marking - the red asterisk sits on the field label, same as Select, independent of how many nodes end up checked.
      
- Validation timing - validate on blur (closing the tree panel with nothing checked) and again on submit.
      
- Error message - "Choose at least one option," not "This field is required" - specific enough to point back at the tree rather than the form in general.
      
- Recovery - an indeterminate-only state (a parent showing a dash because some, not all, descendants are checked, with no node explicitly checked by the user) does not satisfy a required rule on its own - require at least one concrete leaf or node to be explicitly checked, and reopen the tree with that branch expanded so the user can see why it's still flagged.

## Component Guide

        Human View
        Machine View

Overview
      
Tree Select is a select field over hierarchical, nested data - the user picks any node, parent or leaf, at any depth from an indented, expandable tree - used when the option set is too deep or too structured for a flat Select or Cascader's linked columns.

When to Use

- An org chart or folder-structure picker - where any level, not just leaves, is a valid selection.
        
- Permission group assignment - picking a specific nested group within a broader hierarchy.
        
- A nested tag selector or report hierarchy filter - where the full tree needs to stay visible and explorable at once.

When Not to Use

- A flat, non-nested option list - use Select - a tree adds visual complexity a flat list doesn't need.
        
- Data where only leaf nodes are ever valid, and the path itself matters more than seeing the whole tree at once - use Cascader's linked-column drill-down instead.
        
- A very large tree with thousands of nodes and no search - add a filter/search mode, or reconsider whether Tree Select is the right control for that scale.

Best Practices

- Let common branches start expanded when the selected value (or a sensible default) lives a level or two deep.
        
- Support typing to filter/search across the whole tree once it grows beyond a quick visual scan.
        
- Show the selected node's full path in the closed trigger, not just its own label, so the selection stays unambiguous.

Do and Don't

Do

Destination folder
Design / Icons

Design
Icons
Logos
          
The control shows the whole path, so "Icons" is never confused with another folder of the same name elsewhere in the tree.

Don't

Destination folder
Icons

Design
Icons
Marketing
Icons
          
Showing only the leaf name makes two different folders look like the same choice once the panel is closed.

Accessibility

- Implemented with tree/treeitem semantics, so screen readers announce each node's depth and expanded/collapsed state.
        
- Fully keyboard-operable - arrow keys move between nodes, and left/right expand or collapse a branch.
        
- The currently selected node is clearly announced, including which ancestor branch it belongs to.

Related Components
      
Select, Cascader, Transfer.

{
  "component": "Tree Select",
  "category": "Forms",
  "summary": "Tree Select is a select field over hierarchical, nested data - the user picks any node, parent or leaf, at any depth from an indented, expandable tree - used when the option set is too deep or too structured for a flat Select or Cascader's linked columns.",
  "whenToUse": [
    "An org chart or folder-structure picker - where any level, not just leaves, is a valid selection.",
    "Permission group assignment - picking a specific nested group within a broader hierarchy.",
    "A nested tag selector or report hierarchy filter - where the full tree needs to stay visible and explorable at once."
  ],
  "whenNotToUse": [
    "A flat, non-nested option list - use Select - a tree adds visual complexity a flat list doesn't need.",
    "Data where only leaf nodes are ever valid, and the path itself matters more than seeing the whole tree at once - use Cascader's linked-column drill-down instead.",
    "A very large tree with thousands of nodes and no search - add a filter/search mode, or reconsider whether Tree Select is the right control for that scale."
  ],
  "bestPractices": [
    "Let common branches start expanded when the selected value (or a sensible default) lives a level or two deep.",
    "Support typing to filter/search across the whole tree once it grows beyond a quick visual scan.",
    "Show the selected node's full path in the closed trigger, not just its own label, so the selection stays unambiguous."
  ],
  "doAndDont": {
    "do": "The control shows the whole path, so \"Icons\" is never confused with another folder of the same name elsewhere in the tree.",
    "dont": "Showing only the leaf name makes two different folders look like the same choice once the panel is closed."
  },
  "accessibility": [
    "Implemented with tree/treeitem semantics, so screen readers announce each node's depth and expanded/collapsed state.",
    "Fully keyboard-operable - arrow keys move between nodes, and left/right expand or collapse a branch.",
    "The currently selected node is clearly announced, including which ancestor branch it belongs to."
  ],
  "relatedComponents": [
    "Select",
    "Cascader",
    "Transfer"
  ]
}

---

## Tree Select

Source: tree-select.html · Status: Available

Components · Forms

# Tree Select
  
A select field for hierarchical, nested data - like an org chart or a folder structure - where any node at any depth can be chosen, shown as an indented, expandable tree when open.

## Tree Select type

Copy a ready-to-paste AI prompt or the working code - both use this system's own color tokens and Inter, never arbitrary values. Click the card to configure it in full.

            Assignee team

Tree Select

          Copy prompt

---

## Tree

Source: tree.html · Status: Available

Components · Data Display

# Tree
  
A standalone, always-visible hierarchical structure with expandable branches - for browsing or selecting nested data like a file system or an org chart, distinct from Tree Select's dropdown-triggered variant.

## Tree type

Copy a ready-to-paste AI prompt or the working code - both use this system's own color tokens and Inter, never arbitrary values. Click the card to configure it in full.

Documents

                  Reports

System Control

          Copy prompt

Documents

                  Reports12 items

                      Q1 Report.pdf1.2 MB

                      Q2 Report.pdf980 KB

Metatext Tree

          Copy prompt

---

## Typography

Source: typography.html · Status: Available

Foundations · Typography

# Typography
  
The typefaces, weights and colors that give every heading and line of body copy the same voice, however the page was generated.

## Font families

        Human View
        Machine View

Primary is used for every heading; Secondary is used for supporting/body text. Upload your own font file, or browse a curated list by category.

      Primary font - headings
      *

        Browse by category
        Upload font

Sans-serif fits mobile apps, web apps and dense UI best; Serif/Display suit editorial or marketing-led desktop sites; Monospace suits code-heavy tools; Handwritten suits playful or informal contexts.

          Sans-serif
          Serif
          Monospace
          Display
          Handwritten

          Font family name

          Choose a .woff, .woff2, .ttf or .otf file…

Aa Bb Cc 123
        
The quick brown fox jumps over the lazy dog.
        
No font selected yet - using the system default.

      Secondary font - supporting text

        Browse by category
        Upload font

Sans-serif fits mobile apps, web apps and dense UI best; Serif/Display suit editorial or marketing-led desktop sites; Monospace suits code-heavy tools; Handwritten suits playful or informal contexts.

          Sans-serif
          Serif
          Monospace
          Display
          Handwritten

          Font family name

          Choose a .woff, .woff2, .ttf or .otf file…

Aa Bb Cc 123
        
The quick brown fox jumps over the lazy dog.
        
No font selected yet - using the system default.

{}

## Type scale

        Human View
        Machine View

Family comes from Primary (headings) or Secondary (supporting text) above - set the weight, style and color for each level to match your brand guideline. Each level carries its own Light and Dark color - Dark starts auto-generated from Light and stays in sync until you edit it directly; "Regenerate dark colors" below resets any you've customized back to that suggestion.

Caption defaults to 11 px for helper labels, metadata and contrast descriptions. Responsive typography: H1–H6, Body, Paragraph and Caption now apply their exact selected metrics across all pages through Foundation tokens. Small screens wrap headings and stack controls without replacing the chosen sizes. Rem mode respects the browser's root font size; the default conversion uses 16 px. Viewport breakpoints stay fixed so changing typography cannot move the layout thresholds. Per-breakpoint type overrides remain a future capability that would need its own explicit controls.
    
Tabular figures: Table's cells and Statistic's headline value both use tabular (fixed-width) digits, so a column of numbers lines up instead of drifting as digit shapes vary - reserved for actual numeric data, not applied to running body text.
    
Foundation audit T04 - H1-H6 here are visual sizes, not an HTML heading-rank mandate: pick whichever level's size reads right for a given piece of text, then choose its actual <h1>-<h6> tag from the page's own real document structure (one visible <h1> per page, ranks nested without skipping) - the two are independent decisions. A page's main heading might need H3's smaller size while still correctly being marked up as the page's one real <h1>; a visually prominent H1-styled pull-quote is still just a <p> or <blockquote>, not a second page heading.

      SaaS
      Mobile App
      Desktop and Web App
      M Web & D Web

          Level
          H1

          Font
          
              Primary
              Secondary

          Size
          
              Text 2XS - 11/16.5px
              Text XS - 12/18px
              Text SM - 14/20px
              Text MD - 16/24px
              Text LG - 18/28px
              Text XL - 20/30px
              Display XS - 24/32px
              Heading MD - 28/36px
              Display SM - 30/38px
              Heading LG - 32/40px
              Display MD - 36/44px
              Display LG - 48/60px
              Display XL - 60/72px
              Display 2XL - 72/90px

          Line height

            %

          Weight
          
              Regular
              Medium
              Semibold
              Bold
              Extrabold

          Italic

Aa Bb Cc - the quick brown fox jumps over the lazy dog

Light theme

Color

                #

Dark theme

Color

                #

          Level
          H2

          Font
          
              Primary
              Secondary

          Size
          
              Text 2XS - 11/16.5px
              Text XS - 12/18px
              Text SM - 14/20px
              Text MD - 16/24px
              Text LG - 18/28px
              Text XL - 20/30px
              Display XS - 24/32px
              Heading MD - 28/36px
              Display SM - 30/38px
              Heading LG - 32/40px
              Display MD - 36/44px
              Display LG - 48/60px
              Display XL - 60/72px
              Display 2XL - 72/90px

          Line height

            %

          Weight
          
              Regular
              Medium
              Semibold
              Bold
              Extrabold

          Italic

Aa Bb Cc - the quick brown fox jumps over the lazy dog

Light theme

Color

                #

Dark theme

Color

                #

          Level
          H3

          Font
          
              Primary
              Secondary

          Size
          
              Text 2XS - 11/16.5px
              Text XS - 12/18px
              Text SM - 14/20px
              Text MD - 16/24px
              Text LG - 18/28px
              Text XL - 20/30px
              Display XS - 24/32px
              Heading MD - 28/36px
              Display SM - 30/38px
              Heading LG - 32/40px
              Display MD - 36/44px
              Display LG - 48/60px
              Display XL - 60/72px
              Display 2XL - 72/90px

          Line height

            %

          Weight
          
              Regular
              Medium
              Semibold
              Bold
              Extrabold

          Italic

Aa Bb Cc - the quick brown fox jumps over the lazy dog

Light theme

Color

                #

Dark theme

Color

                #

          Level
          H4

          Font
          
              Primary
              Secondary

          Size
          
              Text 2XS - 11/16.5px
              Text XS - 12/18px
              Text SM - 14/20px
              Text MD - 16/24px
              Text LG - 18/28px
              Text XL - 20/30px
              Display XS - 24/32px
              Heading MD - 28/36px
              Display SM - 30/38px
              Heading LG - 32/40px
              Display MD - 36/44px
              Display LG - 48/60px
              Display XL - 60/72px
              Display 2XL - 72/90px

          Line height

            %

          Weight
          
              Regular
              Medium
              Semibold
              Bold
              Extrabold

          Italic

Aa Bb Cc - the quick brown fox jumps over the lazy dog

Light theme

Color

                #

Dark theme

Color

                #

          Level
          H5

          Font
          
              Primary
              Secondary

          Size
          
              Text 2XS - 11/16.5px
              Text XS - 12/18px
              Text SM - 14/20px
              Text MD - 16/24px
              Text LG - 18/28px
              Text XL - 20/30px
              Display XS - 24/32px
              Heading MD - 28/36px
              Display SM - 30/38px
              Heading LG - 32/40px
              Display MD - 36/44px
              Display LG - 48/60px
              Display XL - 60/72px
              Display 2XL - 72/90px

          Line height

            %

          Weight
          
              Regular
              Medium
              Semibold
              Bold
              Extrabold

          Italic

Aa Bb Cc - the quick brown fox jumps over the lazy dog

Light theme

Color

                #

Dark theme

Color

                #

          Level
          H6

          Font
          
              Primary
              Secondary

          Size
          
              Text 2XS - 11/16.5px
              Text XS - 12/18px
              Text SM - 14/20px
              Text MD - 16/24px
              Text LG - 18/28px
              Text XL - 20/30px
              Display XS - 24/32px
              Heading MD - 28/36px
              Display SM - 30/38px
              Heading LG - 32/40px
              Display MD - 36/44px
              Display LG - 48/60px
              Display XL - 60/72px
              Display 2XL - 72/90px

          Line height

            %

          Weight
          
              Regular
              Medium
              Semibold
              Bold
              Extrabold

          Italic

Aa Bb Cc - the quick brown fox jumps over the lazy dog

Light theme

Color

                #

Dark theme

Color

                #

Running text
    
Foundation audit T04 - Body and Paragraph share the same default size/weight/color on purpose, not by oversight: they're the same visual style, distinguished by where each applies, not by how either looks. Use Body for a single line or short run of supporting text outside a real <p> (a card's description line, a table cell, a button's helper text); use Paragraph specifically for actual <p>-tagged prose, so a page with several paragraphs of running text still gets real paragraph markup (and whatever margin/spacing between them that implies) rather than a string of unrelated one-off text elements. Customize either independently if a real need ever calls for it - staying identical is the default, not a constraint.

          Level
          Body

          Font
          
              Primary
              Secondary

          Size
          
              Text 2XS - 11/16.5px
              Text XS - 12/18px
              Text SM - 14/20px
              Text MD - 16/24px
              Text LG - 18/28px
              Text XL - 20/30px
              Display XS - 24/32px
              Heading MD - 28/36px
              Display SM - 30/38px
              Heading LG - 32/40px
              Display MD - 36/44px
              Display LG - 48/60px
              Display XL - 60/72px
              Display 2XL - 72/90px

          Line height

            %

          Weight
          
              Regular
              Medium
              Semibold
              Bold
              Extrabold

          Italic

Aa Bb Cc - the quick brown fox jumps over the lazy dog

Light theme

Color

                #

Dark theme

Color

                #

          Level
          Paragraph

          Font
          
              Primary
              Secondary

          Size
          
              Text 2XS - 11/16.5px
              Text XS - 12/18px
              Text SM - 14/20px
              Text MD - 16/24px
              Text LG - 18/28px
              Text XL - 20/30px
              Display XS - 24/32px
              Heading MD - 28/36px
              Display SM - 30/38px
              Heading LG - 32/40px
              Display MD - 36/44px
              Display LG - 48/60px
              Display XL - 60/72px
              Display 2XL - 72/90px

          Line height

            %

          Weight
          
              Regular
              Medium
              Semibold
              Bold
              Extrabold

          Italic

Aa Bb Cc - the quick brown fox jumps over the lazy dog

Light theme

Color

                #

Dark theme

Color

                #

          Level
          Caption

          Font
          
              Primary
              Secondary

          Size
          
              Text 2XS - 11/16.5px
              Text XS - 12/18px
              Text SM - 14/20px
              Text MD - 16/24px
              Text LG - 18/28px
              Text XL - 20/30px
              Display XS - 24/32px
              Heading MD - 28/36px
              Display SM - 30/38px
              Heading LG - 32/40px
              Display MD - 36/44px
              Display LG - 48/60px
              Display XL - 60/72px
              Display 2XL - 72/90px

          Line height

            %

          Weight
          
              Regular
              Medium
              Semibold
              Bold
              Extrabold

          Italic

Aa Bb Cc - the quick brown fox jumps over the lazy dog

Light theme

Color

                #

Dark theme

Color

                #

State colors
    
Foundation audit T04 - "Interaction states treated as independent type levels; visual style confused with semantic hierarchy." These 7 rows (Active/Selected/Disabled/Error/Warning/Success/Info) aren't peers of H1-H6/Body/Paragraph/Caption above in a hierarchy - they're a different axis entirely: a color modifier meant to apply on top of whatever role's own size/weight is already in use (a nav link using Caption's size, recolored when Active; a form label using Body's size, recolored when Disabled). Every one of them ships at the same default size and line height (Text SM, 143%) specifically so changing state never changes layout - size/weight/line-height/italic controls are still here for real edge cases, but the default, recommended pattern is to leave them alone and change color only; independently resizing one breaks visual consistency with whatever base role it's actually modifying.

          Level
          Active

          Font
          
              Primary
              Secondary

          Size
          
              Text 2XS - 11/16.5px
              Text XS - 12/18px
              Text SM - 14/20px
              Text MD - 16/24px
              Text LG - 18/28px
              Text XL - 20/30px
              Display XS - 24/32px
              Heading MD - 28/36px
              Display SM - 30/38px
              Heading LG - 32/40px
              Display MD - 36/44px
              Display LG - 48/60px
              Display XL - 60/72px
              Display 2XL - 72/90px

          Line height

            %

          Weight
          
              Regular
              Medium
              Semibold
              Bold
              Extrabold

          Italic

Aa Bb Cc - the quick brown fox jumps over the lazy dog

Light theme

Color

                #

Dark theme

Color

                #

          Level
          Selected

          Font
          
              Primary
              Secondary

          Size
          
              Text 2XS - 11/16.5px
              Text XS - 12/18px
              Text SM - 14/20px
              Text MD - 16/24px
              Text LG - 18/28px
              Text XL - 20/30px
              Display XS - 24/32px
              Heading MD - 28/36px
              Display SM - 30/38px
              Heading LG - 32/40px
              Display MD - 36/44px
              Display LG - 48/60px
              Display XL - 60/72px
              Display 2XL - 72/90px

          Line height

            %

          Weight
          
              Regular
              Medium
              Semibold
              Bold
              Extrabold

          Italic

Aa Bb Cc - the quick brown fox jumps over the lazy dog

Light theme

Color

                #

Dark theme

Color

                #

          Level
          Disabled

          Font
          
              Primary
              Secondary

          Size
          
              Text 2XS - 11/16.5px
              Text XS - 12/18px
              Text SM - 14/20px
              Text MD - 16/24px
              Text LG - 18/28px
              Text XL - 20/30px
              Display XS - 24/32px
              Heading MD - 28/36px
              Display SM - 30/38px
              Heading LG - 32/40px
              Display MD - 36/44px
              Display LG - 48/60px
              Display XL - 60/72px
              Display 2XL - 72/90px

          Line height

            %

          Weight
          
              Regular
              Medium
              Semibold
              Bold
              Extrabold

          Italic

Aa Bb Cc - the quick brown fox jumps over the lazy dog

Light theme

Color

                #

Dark theme

Color

                #

          Level
          Error

          Font
          
              Primary
              Secondary

          Size
          
              Text 2XS - 11/16.5px
              Text XS - 12/18px
              Text SM - 14/20px
              Text MD - 16/24px
              Text LG - 18/28px
              Text XL - 20/30px
              Display XS - 24/32px
              Heading MD - 28/36px
              Display SM - 30/38px
              Heading LG - 32/40px
              Display MD - 36/44px
              Display LG - 48/60px
              Display XL - 60/72px
              Display 2XL - 72/90px

          Line height

            %

          Weight
          
              Regular
              Medium
              Semibold
              Bold
              Extrabold

          Italic

Aa Bb Cc - the quick brown fox jumps over the lazy dog

Light theme

Color

                #

Dark theme

Color

                #

          Level
          Warning

          Font
          
              Primary
              Secondary

          Size
          
              Text 2XS - 11/16.5px
              Text XS - 12/18px
              Text SM - 14/20px
              Text MD - 16/24px
              Text LG - 18/28px
              Text XL - 20/30px
              Display XS - 24/32px
              Heading MD - 28/36px
              Display SM - 30/38px
              Heading LG - 32/40px
              Display MD - 36/44px
              Display LG - 48/60px
              Display XL - 60/72px
              Display 2XL - 72/90px

          Line height

            %

          Weight
          
              Regular
              Medium
              Semibold
              Bold
              Extrabold

          Italic

Aa Bb Cc - the quick brown fox jumps over the lazy dog

Light theme

Color

                #

Dark theme

Color

                #

          Level
          Success

          Font
          
              Primary
              Secondary

          Size
          
              Text 2XS - 11/16.5px
              Text XS - 12/18px
              Text SM - 14/20px
              Text MD - 16/24px
              Text LG - 18/28px
              Text XL - 20/30px
              Display XS - 24/32px
              Heading MD - 28/36px
              Display SM - 30/38px
              Heading LG - 32/40px
              Display MD - 36/44px
              Display LG - 48/60px
              Display XL - 60/72px
              Display 2XL - 72/90px

          Line height

            %

          Weight
          
              Regular
              Medium
              Semibold
              Bold
              Extrabold

          Italic

Aa Bb Cc - the quick brown fox jumps over the lazy dog

Light theme

Color

                #

Dark theme

Color

                #

          Level
          Info

          Font
          
              Primary
              Secondary

          Size
          
              Text 2XS - 11/16.5px
              Text XS - 12/18px
              Text SM - 14/20px
              Text MD - 16/24px
              Text LG - 18/28px
              Text XL - 20/30px
              Display XS - 24/32px
              Heading MD - 28/36px
              Display SM - 30/38px
              Heading LG - 32/40px
              Display MD - 36/44px
              Display LG - 48/60px
              Display XL - 60/72px
              Display 2XL - 72/90px

          Line height

            %

          Weight
          
              Regular
              Medium
              Semibold
              Bold
              Extrabold

          Italic

Aa Bb Cc - the quick brown fox jumps over the lazy dog

Light theme

Color

                #

Dark theme

Color

                #

      Save typography
      Regenerate dark colors
      Reset to defaults

{}

## Additional semantic levels

        Human View
        Machine View

Six more text roles that don't need their own row above - each already has a real, consistent value in use sitewide, referenced here rather than re-declared as a new editable level.

        Button text
        Scales with the button's own height (11-17px across the seven sizes) - never a fixed size independent of the control it labels
        11-17px, weight 600

        Table cell
        Smaller than Body, since a data table trades reading comfort for density; numeric cells use tabular figures (Type scale panel above)
        13px / Secondary font

        Code / monospace
        Always the monospace family, never Primary/Secondary - inline code, tokens and technical values
        var(--font-mono)

        Link
        Brand red, underlined on hover - the same treatment already used for every inline text link sitewide
        var(--red-400), underline on hover

        Label
        A form field's own caption - monospace, small, wide tracking, muted color, matching every control label already in this system
        11px, var(--tracking-5), var(--text-dim)

        Overline / eyebrow
        The small red label above every page title (e.g. "Foundations · Typography") - monospace, wide tracking, brand-colored
        12px, var(--tracking-14), var(--red-400)

AI Rule
      
Generated interfaces must take every font size, weight and line-height from this page's Type Scale (or the Additional semantic levels above) - never an arbitrary value, and never a size interpolated between two scale steps to arrive at a novel one.

{}

## Typography tokens - Markdown export
    
A Markdown snapshot of Font families and every Type scale row above - regenerates live as you edit, so it's always in sync. Copy it straight into your design system docs or hand it to an AI/agent workflow.

      Copy Markdown

## Implementation contract

Saved validated choices override project recommendations, which override system defaults. This implementation contract governs static specimens. Resolved tokens in the current export are authoritative values. Component exceptions must name the affected role and reason.

### Roles
Default heading sizes are H1 32px (2rem), H2 28px (1.75rem), H3 24px (1.5rem), H4 20px (1.25rem), H5 18px (1.125rem), H6 16px (1rem). Each role resolves family, size, weight, line height, tracking, style and color. Use semantic HTML for document hierarchy independently of visual size. Body and Paragraph default to 16px and Caption to 11px. Larger display sizes remain explicit custom choices.

### State modifiers
Active, Selected, Disabled, Error, Warning, Success and Info are color modifiers. A state must inherit its base role's metrics to avoid layout movement. Independent state metrics in the editor are explicit specimen overrides and must not be applied as a universal state typography recipe. Use the state color token over the original role.

### Component role mapping
Buttons, form labels, table cells and link text inherit Body metrics; dense metadata uses Caption; a form's helper or error text keeps the underlying label/body size and adds its state color. Eyebrows may use Caption with approved case; code uses the monospace family with Body dimensions. HTML headings preserve hierarchy even when a visual role differs. Default enabled text colors pass 4.5:1 on default page/panel/raised surfaces; saved custom text/surface colors require a new pair check.

### Responsive usage
Saved roles apply consistently across widths. Optional product-specific fluid headings use clamp(1.5rem, 2vw + 1rem, 3rem) for H1, with explicit exported min/max. Body and paragraph stay readable at 1rem; do not automatically shrink text to fit. Caption remains the user-requested 11px role. Content wraps and 200% zoom remains supported. Platform presets seed values; edited presets become custom.

### Fonts and recovery
Load actual faces and required weights, not only a successful stylesheet. Files are WOFF/WOFF2/TTF/OTF up to 2MB. Include uploaded data and remote stylesheet dependencies in the Foundation JSON. Stale completion cannot overwrite a newer selection or reset. Preserve the last valid font on failure and show a category-appropriate fallback.

### Validation and examples
Line height is 50–300%, tracking -5–20px and weight 100–900. Blank tracking is invalid. Validate full hex before applying. Check text on the actual panel and error/tint surface. Exercise German expansion, Arabic RTL and Japanese wrapping, plus user line/word/letter-spacing overrides.

### Preset changes and handoff
Project Setup seeds the initial platform preset when no Typography override is saved. A saved scale is retained across project edits. Review role sizes before Save foundation; Edit foundation unlocks saved settings. Export all semantic roles, metrics, responsive policy, fonts and px/rem equivalents.

### Save and edit
Selections preview immediately. Save foundation commits valid settings in this browser and locks the editor. Select Edit foundation to revise saved settings; Cancel retains the saved settings. Storage failure keeps the draft editable.
Machine contract: section rules, storage, units and acceptance
{
  "schemaVersion": 1,
  "authority": "Saved validated choices override project recommendations, which override system defaults. This implementation contract governs static specimens. Resolved tokens in the current export are authoritative values. Component exceptions must name the affected role and reason.",
  "governance": {
    "owners": "Design System Lead owns token and compatibility policy. Designers own specimens and interaction contracts. Developers own resolver/export/import parity. QA and Accessibility own release evidence. Product teams own domain-specific confidence, privacy and retention policies.",
    "changes": "Change the JSON contract first, regenerate documentation/defaults/catalog/tokens, then run model, DOM and recipient checks. Link the changed finding IDs and evidence in the release review.",
    "compatibility": "Keep hue-named CSS tokens as compatibility aliases while semantic consumers migrate. Additive tokens retain schemaVersion 1. A removed/renamed key or changed stored meaning requires a schema migration, a version bump and a documented replacement before release. Keep the prior reader fixture until the migration is verified.",
    "deprecation": "Record old key, replacement, reason, introduced version, planned removal version and affected consumers. Do not remove a token while an active consumer still uses it. Future records are preserved rather than coerced.",
    "scope": "This is a web design system with one shared workspace profile. Native dp/sp adaptation and real agent execution require separate adapters and acceptance. User-defined colors and responsive exceptions require product-specific rendered verification."
  },
  "storage": {
    "version": 1,
    "legacy": "Unversioned valid records migrate in memory. Typography headingScaleVersion 2 applies the smaller six-heading scale once to older records, retaining other roles and existing font/color/style metrics. Later custom size edits are retained. Unsupported future records are preserved. The next successful write stamps the migrated version.",
    "future": "Reject unsupported future versions. Preserve raw data. Offer backup and explicit reset.",
    "invalid": "Foundation selections preview locally until Save foundation succeeds. Saved Foundation editors require Edit foundation before changes. Cancel discards the preview. Invalid drafts never replace saved records; storage failures retain the editable preview and the last durable record.",
    "concurrency": "A storage event refreshes applied tokens and disables stale editor controls until reload. Never merge simultaneous edits silently."
  },
  "units": {
    "base": "1rem = 16px at default browser settings. Do not fix the root font size.",
    "use": "Prefer rem for typography, spacing and control dimensions. Hairline borders and viewport thresholds may use px. Both equivalents appear in Markdown. SVG strokes use viewBox units. Ratios, percentages, columns, timing and weights are unitless or retain their own units.",
    "native": "Web CSS px/rem are not native dp/sp. A native adapter must map semantic roles, support text scaling and test device density. Native rendering is not shipped by this web library."
  },
  "acceptance": [
    "Compare page, applied tokens, durable record, Machine View and exported instructions.",
    "Test valid, unfinished, invalid, missing, malformed, legacy and future records. Exercise storage failure, reset, reload and another tab.",
    "Test 320, 375, 768, 1024 and 1440px widths, 200% zoom, text-spacing overrides, RTL and long/localized labels.",
    "Use keyboard and screen reader. Confirm focus return, names, values, error associations and status announcements.",
    "Verify actual rendered text/surface pairs, forced colors, reduced motion, print and exported recipes in a recipient fixture. Source or DOM checks alone are not rendered acceptance."
  ],
  "layers": {
    "content": 0,
    "sticky": 20,
    "popover": 40,
    "scrim": 60,
    "dialog": 70,
    "toast": 80,
    "tooltip": 90,
    "rules": "Each overlay gets an explicit owner and close/focus-return path. Portal menus out of clipped scroll containers. Nested dialogs stack one scrim per modal owner. Escape closes the top dismissible layer. Tooltips never block actions. Test collision and zoom; do not infer stacking order from shadow size."
  },
  "section": {
    "title": "Typography",
    "rules": {
      "Roles": "Default heading sizes are H1 32px (2rem), H2 28px (1.75rem), H3 24px (1.5rem), H4 20px (1.25rem), H5 18px (1.125rem), H6 16px (1rem). Each role resolves family, size, weight, line height, tracking, style and color. Use semantic HTML for document hierarchy independently of visual size. Body and Paragraph default to 16px and Caption to 11px. Larger display sizes remain explicit custom choices.",
      "State modifiers": "Active, Selected, Disabled, Error, Warning, Success and Info are color modifiers. A state must inherit its base role's metrics to avoid layout movement. Independent state metrics in the editor are explicit specimen overrides and must not be applied as a universal state typography recipe. Use the state color token over the original role.",
      "Component role mapping": "Buttons, form labels, table cells and link text inherit Body metrics; dense metadata uses Caption; a form's helper or error text keeps the underlying label/body size and adds its state color. Eyebrows may use Caption with approved case; code uses the monospace family with Body dimensions. HTML headings preserve hierarchy even when a visual role differs. Default enabled text colors pass 4.5:1 on default page/panel/raised surfaces; saved custom text/surface colors require a new pair check.",
      "Responsive usage": "Saved roles apply consistently across widths. Optional product-specific fluid headings use clamp(1.5rem, 2vw + 1rem, 3rem) for H1, with explicit exported min/max. Body and paragraph stay readable at 1rem; do not automatically shrink text to fit. Caption remains the user-requested 11px role. Content wraps and 200% zoom remains supported. Platform presets seed values; edited presets become custom.",
      "Fonts and recovery": "Load actual faces and required weights, not only a successful stylesheet. Files are WOFF/WOFF2/TTF/OTF up to 2MB. Include uploaded data and remote stylesheet dependencies in the Foundation JSON. Stale completion cannot overwrite a newer selection or reset. Preserve the last valid font on failure and show a category-appropriate fallback.",
      "Validation and examples": "Line height is 50\u2013300%, tracking -5\u201320px and weight 100\u2013900. Blank tracking is invalid. Validate full hex before applying. Check text on the actual panel and error/tint surface. Exercise German expansion, Arabic RTL and Japanese wrapping, plus user line/word/letter-spacing overrides.",
      "Preset changes and handoff": "Project Setup seeds the initial platform preset when no Typography override is saved. A saved scale is retained across project edits. Review role sizes before Save foundation; Edit foundation unlocks saved settings. Export all semantic roles, metrics, responsive policy, fonts and px/rem equivalents.",
      "Save and edit": "Selections preview immediately. Save foundation commits valid settings in this browser and locks the editor. Select Edit foundation to revise saved settings; Cancel retains the saved settings. Storage failure keeps the draft editable."
    }
  }
}

---

## Upload

Source: upload-default.html · Status: Available

Components · Forms · Upload
  Back to Upload types

# Upload
  
Owner: Design System Team · Version: v3.5.0 · Changelog
  
Use for adding one or more files to a form - either a large drag-and-drop dropzone or a compact trigger button, paired with a file list that reports each file's name, size and upload status - one Upload component, controlled by properties, not separate widgets glued together.

## Properties

Label and helper text are properties of the same component, not separate fields - change them below to check this control's style and states in the Live Preview.

        Label

        Helper text

## Live Preview
    
Both types compared side by side, each in all 10 states, using the chosen label and helper text. Dragging looks the same for Button as Hover, since there is no dropzone area to drag a file onto. Real drag-and-drop, file validation and upload progress wiring are a larger feature and are not built in this static preview.

## When to use
    
Any form flow that needs the user to add one or more files, with clear feedback on what was added and whether it uploaded successfully.

      Document attachment
      Profile photo upload
      Bulk CSV import
      Design asset submission
      Resume/CV upload

## Validation
    
Upload has three distinct failure modes, and each needs its own timing and its own message - lumping them into one generic "Upload failed" tells the user nothing about what to change or whether their other files are still safe.

- Required marking - if at least one file is required before submit, mark the field the same way any other required field is marked, and keep submit disabled (or the first submit attempt blocked with an inline message) until a file is present - don't let the user reach a server-side rejection for something the form already knew.
      
- Validation timing - type and size are both knowable the instant a file is selected or dropped, so check both before any upload attempt starts. Never let a doomed upload begin just to fail later - that wastes the user's time and bandwidth for an error the client already had the information to catch.
      
- Wrong file type - reject on selection/drop, not after. Show the message inline on that file's own row, not a top-of-page banner, and name the file and what it actually is: "PDF, PNG or JPG only - invoice-scan.heic is a .heic file." The row never enters the list as if it were queued to upload.
      
- File too large - also reject on selection, before any transfer starts: "invoice-scan.pdf is 42 MB - the limit is 25 MB." Don't rely on this row-level message alone - state the size limit up front near the dropzone (in the helper text or a caption), so most oversized files are ruled out before the user even picks one.
      
- Network failure mid-upload - the one failure that can't be caught before the transfer starts. Move that file's row to a distinct error state instead of letting it silently disappear or silently retry - "Upload interrupted - check your connection and try again," with a Retry action scoped to that row alone. Retrying one failed file must never re-trigger or disturb files that already finished successfully.

## Component Guide

        Human View
        Machine View

Overview
      
Upload adds one or more files to a form - either a large drag-and-drop dropzone or a compact trigger button - paired with a file list that reports each file's name, size, and upload status, so the user always knows what was added and whether it succeeded.

When to Use

- Attaching documents to a record - a support ticket, an application form.
        
- Uploading a profile photo or design asset - a single-file, often image-specific upload.
        
- Bulk file import - a CSV import, a batch of resumes/CVs.

When Not to Use

- Collecting a URL to an already-hosted file rather than the file itself - use Input or Add-on instead.
        
- A field that doesn't actually involve a file - obviously use a different form field type - Upload exists specifically for file transfer.
        
- A single, tiny, purely decorative image with no need for status feedback - a simpler custom control may be lighter weight than the full Upload component.

Best Practices

- Always show per-file progress and a clear success/error state, not just a single overall spinner.
        
- State accepted file types and size limits up front, before the user picks a file, not only after a rejected upload.
        
- Let the user remove a file from the list before final submission, in case they attached the wrong one.

Do and Don't

Do

Drop files or browse
PDF or PNG, up to 10 MB each

contract.pdf2.4 MB
          
Accepted formats and the size ceiling are stated before the user picks a file, and each upload reports its own outcome.

Don't

Drop files or browse

contract.tiffUpload failed
          
Withholding the rules until after the upload wastes the user's time and bandwidth, and "Upload failed" still does not tell them what to change.

Accessibility

- The dropzone is also operable via a real file-picker trigger, since drag-and-drop alone isn't reachable by keyboard.
        
- Upload progress and completion/error status are announced via an aria-live region, not just shown visually.
        
- Each file row's remove control is independently labeled with that file's name ("Remove report.pdf"), not a generic "Remove" repeated for every row.

Related Components
      
Input, Progress, Result.

{
  "component": "Upload",
  "category": "Forms",
  "summary": "Upload adds one or more files to a form - either a large drag-and-drop dropzone or a compact trigger button - paired with a file list that reports each file's name, size, and upload status, so the user always knows what was added and whether it succeeded.",
  "whenToUse": [
    "Attaching documents to a record - a support ticket, an application form.",
    "Uploading a profile photo or design asset - a single-file, often image-specific upload.",
    "Bulk file import - a CSV import, a batch of resumes/CVs."
  ],
  "whenNotToUse": [
    "Collecting a URL to an already-hosted file rather than the file itself - use Input or Add-on instead.",
    "A field that doesn't actually involve a file - obviously use a different form field type - Upload exists specifically for file transfer.",
    "A single, tiny, purely decorative image with no need for status feedback - a simpler custom control may be lighter weight than the full Upload component."
  ],
  "bestPractices": [
    "Always show per-file progress and a clear success/error state, not just a single overall spinner.",
    "State accepted file types and size limits up front, before the user picks a file, not only after a rejected upload.",
    "Let the user remove a file from the list before final submission, in case they attached the wrong one."
  ],
  "doAndDont": {
    "do": "Accepted formats and the size ceiling are stated before the user picks a file, and each upload reports its own outcome.",
    "dont": "Withholding the rules until after the upload wastes the user's time and bandwidth, and \"Upload failed\" still does not tell them what to change."
  },
  "accessibility": [
    "The dropzone is also operable via a real file-picker trigger, since drag-and-drop alone isn't reachable by keyboard.",
    "Upload progress and completion/error status are announced via an aria-live region, not just shown visually.",
    "Each file row's remove control is independently labeled with that file's name (\"Remove report.pdf\"), not a generic \"Remove\" repeated for every row."
  ],
  "relatedComponents": [
    "Input",
    "Progress",
    "Result"
  ]
}

---

## Upload

Source: upload.html · Status: Available

Components · Forms

# Upload
  
A drag-and-drop dropzone or a button-triggered control for adding files, paired with a file list that shows each file's name, size and upload status.

## Upload type

Copy a ready-to-paste AI prompt or the working code - both use this system's own color tokens and Inter, never arbitrary values. Click the card to configure it in full.

Click or drag file to upload
              
PNG, JPG or PDF up to 10MB

                  report.pdf
                  2.4 MB

                  diagram.png
                  890 KB

                55%

System Control

          Copy prompt

## Implementation contract

Saved validated choices override project recommendations, which override system defaults. This implementation contract governs static specimens. Resolved tokens in the current export are authoritative values. Component exceptions must name the affected role and reason.

### Ownership and compatibility

- owners: Design System Lead owns token and compatibility policy. Designers own specimens and interaction contracts. Developers own resolver/export/import parity. QA and Accessibility own release evidence. Product teams own domain-specific confidence, privacy and retention policies.
- changes: Change the JSON contract first, regenerate documentation/defaults/catalog/tokens, then run model, DOM and recipient checks. Link the changed finding IDs and evidence in the release review.
- compatibility: Keep hue-named CSS tokens as compatibility aliases while semantic consumers migrate. Additive tokens retain schemaVersion 1. A removed/renamed key or changed stored meaning requires a schema migration, a version bump and a documented replacement before release. Keep the prior reader fixture until the migration is verified.
- deprecation: Record old key, replacement, reason, introduced version, planned removal version and affected consumers. Do not remove a token while an active consumer still uses it. Future records are preserved rather than coerced.
- scope: This is a web design system with one shared workspace profile. Native dp/sp adaptation and real agent execution require separate adapters and acceptance. User-defined colors and responsive exceptions require product-specific rendered verification.

### Storage and recovery

- version: 1
- legacy: Unversioned valid records migrate in memory. Typography headingScaleVersion 2 applies the smaller six-heading scale once to older records, retaining other roles and existing font/color/style metrics. Later custom size edits are retained. Unsupported future records are preserved. The next successful write stamps the migrated version.
- future: Reject unsupported future versions. Preserve raw data. Offer backup and explicit reset.
- invalid: Foundation selections preview locally until Save foundation succeeds. Saved Foundation editors require Edit foundation before changes. Cancel discards the preview. Invalid drafts never replace saved records; storage failures retain the editable preview and the last durable record.
- concurrency: A storage event refreshes applied tokens and disables stale editor controls until reload. Never merge simultaneous edits silently.

### Units

- 1rem = 16px at default browser settings. Do not fix the root font size.
- Prefer rem for typography, spacing and control dimensions. Hairline borders and viewport thresholds may use px. Both equivalents appear in Markdown. SVG strokes use viewBox units. Ratios, percentages, columns, timing and weights are unitless or retain their own units.
- Web CSS px/rem are not native dp/sp. A native adapter must map semantic roles, support text scaling and test device density. Native rendering is not shipped by this web library.

### Layers

{"content":0,"sticky":20,"popover":40,"scrim":60,"dialog":70,"toast":80,"tooltip":90,"rules":"Each overlay gets an explicit owner and close/focus-return path. Portal menus out of clipped scroll containers. Nested dialogs stack one scrim per modal owner. Escape closes the top dismissible layer. Tooltips never block actions. Test collision and zoom; do not infer stacking order from shadow size."}

### Acceptance still required

- Compare page, applied tokens, durable record, Machine View and exported instructions.
- Test valid, unfinished, invalid, missing, malformed, legacy and future records. Exercise storage failure, reset, reload and another tab.
- Test 320, 375, 768, 1024 and 1440px widths, 200% zoom, text-spacing overrides, RTL and long/localized labels.
- Use keyboard and screen reader. Confirm focus return, names, values, error associations and status announcements.
- Verify actual rendered text/surface pairs, forced colors, reduced motion, print and exported recipes in a recipient fixture. Source or DOM checks alone are not rendered acceptance.

### Project setup

- User and task flow: Every fresh or returning top-level visit starts at new-project.html with both project choices visible, including the launcher, directory index, local server root, direct bookmarks and reopened conversation URLs. Choose Existing project to search saved projects in the unified Overview project hub, or New project to open a full-height chatbot. Use a scrollable conversation with unboxed assistant messages, user reply bubbles and a reply composer anchored below it. Show Project, About you, Design and Review stages with the current stage marked. Use the library’s resolved type, color, radius, spacing and focus tokens. Ask project, product, platforms, identity and design preferences one question at a time. Single-choice option cards send immediately; show available descriptions and visual spacing/corner samples. Brand color supports a native color picker synchronized with the hex reply. The multi-select Platforms question shows a selected-count status and an explicit Continue button directly beneath its chips, disabled until the selection is valid; text replies support Enter to send and Shift+Enter for a new line, while focused buttons retain their native keyboard actions. Clicking a single-choice card takes precedence over any earlier typed choice. A brief typing transition introduces the next local question. Show the live editable project brief and answered-count progress in a persistent desktop side panel; on narrower screens keep pinned answers in a header-controlled panel with Escape and focus return. Summarize the complete brief and require explicit confirmation before saving. Show centered progress for actual brief, palette, typography/layout, component Foundation, theme and save operations. Save the profile and validated Foundation records together, preserving the previous project in local history. Overview lists saved projects, supports name search and reopening, shows unfinished drafts and the active project’s next Foundation/export action. Keep one contextual header action: New project when there is no draft, or Continue draft when unfinished work exists; library and guideline navigation stays in the sidebar. Legacy History URLs redirect to Overview after normal application entry; omit the redundant History navigation item.
- Navigation and recovery: Validate each submitted answer. Changing a pinned answer returns to the next unanswered question or summary without erasing other replies. Drafts preserve confirmed replies, unfinished input per question even while editing earlier answers, creation/edit intent and the source-project baseline. Batch text autosaves with a 200ms debounce; flush pending input on blur, page hide and backgrounding, and save selections and submissions immediately. Compare the stored draft and profile baseline before writing; conflicts cancel queued saves and cannot overwrite newer work. Cancel clears queued autosaves; selecting New project automatically restores a readable unfinished draft directly into the chatbot without a Resume/Discard screen. Failed saves restore previous project and Foundation records and retain the conversation. Reject stale cross-tab profile, draft or Foundation changes. Preserve unreadable and future records with backup/discard recovery. First entry never auto-opens a saved profile or draft; New project restores readable drafts directly; only unreadable or unsupported saved data requires a recovery screen. One-use in-app navigation handoffs preserve normal browsing and explicit editor reloads. Browser refresh starts at choices. Component preview frames retain their requested page.
- Context and readiness: Product and platforms inform Grid & Layout and Typography. Explicit brand color, spacing, corner-radius philosophy and icon style override recommendations. Confirmation authorizes the prepared Foundation settings and library defaults for remaining choices. Progress checkmarks reflect completed preparation or a verified save, never a simulated external AI request. All saved settings remain editable in Foundations; per-platform handoff guidance remains available.
- Categories and identity: Dashboard describes a data-focused product; Desktop web describes delivery. All project details are required for new saves. Older profiles remain readable until explicitly edited. Identity remains excluded from handoff unless opted in.
- Handoff: Export all nine Foundations, effective values in both themes, rules, font dependencies, icon-reference assets and unresolved acceptance checks. Do not claim a published release or send an invitation from a local example.
- Review and edit saved setup: Project setup navigation opens project-setup.html, where the active project’s eleven onboarding answers appear in Project details, About you and Design choices. Edit setup prefills the existing answers; Save changes validates and updates the same project, while Cancel preserves saved data. Project and identity edits do not reapply Foundation defaults. Changed brand, spacing, corners and icon choices patch only their corresponding Foundation records and preserve unrelated customizations. Respect unfinished onboarding drafts and cross-tab conflicts. New visits still enter through the welcome choices.

### Colors

- User and task flow: Set brand, surfaces, statuses and neutrals independently. Inspect light/dark applied pairs, save valid choices, then copy the current configuration. Enabling dark editing is durable and does not couple Danger to Brand.
- Roles and states: Brand communicates selection/actions; Success, Warning, Danger and Info communicate severity. Charts use a separate series palette. Foreground is selected per actual primary-button state. Status text uses an accessible semantic foreground against its real surface, not an untested raw hue.
- Accessible pairs: Normal text requires 4.5:1 and large text 3:1; essential non-text boundaries require 3:1. Decorative lines and disabled controls have different scope. Calculate alpha-composited backgrounds first. Recheck current Typography colors after surface edits. A passing swatch is not certification of every component.
- Derivation and hierarchy: Resolver version 1 derives hover by mixing brand with 25% white and pressed by mixing with 18% black; tint is 8% brand and glow 35%. Semantic readable foregrounds move toward black or white until the actual surface pair passes 4.5:1. Highly customized surfaces can collapse the page/panel/raised hierarchy: use a neutral border or restore separation deliberately; luminance order alone is not a universal hierarchy guarantee.
- Compatibility mapping: Existing red-* tokens represent brand/action; danger-* represent severity. type-*-color represents text by role; graphite-950/900/850 represents page/panel/raised surfaces. Prefer the exported color-brand, color-action, color-text and color-surface aliases for new consumers. Compatibility names retain their existing meaning and are not a license to use a brand hue for error feedback.
- Examples and recovery: A red brand with a red Danger is two independent choices. White text on default red can fail; use the resolved on-brand foreground. For a tinted Tag calculate status text versus its tinted surface. Use label/icon/message in addition to hue. Keep full hex validation and the last valid value while typing.
- Responsive and interaction: Picker numeric controls remain keyboard accessible. Escape returns focus to the trigger; outside dismissal does not trap focus. At narrow/zoomed widths keep fields and popup inside the content viewport. Use forced-color system colors rather than relying on tinted fills.
- Agent and export: Use semantic aliases and resolved light/dark values. Never infer status from brand hue or declare AA from a color alone. Export the pair, opacity, state, surface and verification result.
- Save and edit: Selections preview immediately. Save foundation commits valid settings in this browser and locks the editor. Select Edit foundation to revise saved settings; Cancel retains the saved settings. Storage failure keeps the draft editable.

### Grid & Layout

- Geometry: Columns are integers 1–24; gutters are integers 0–64px. Rows, Columns+Rows and Custom obey the same validation. Baseline is independent. Custom requires explicit geometry; saved geometry is the buildable result, not a preset name.
- Platform profiles: The workspace applies one global profile. One selected platform supplies its recommendation; multiple platforms use the product recommendation. Exports also include a light/dark recommendation snapshot for each selected platform, with saved overrides retained. Consumers choose the matching platform profile explicitly; these exports do not automatically implement native layouts or viewport switching. Unsupported context falls back to system defaults and requires review.
- Container and spans: Use a centered container capped by --size-content (default 1200px), min-width:0, equal logical gutters and border-box sizing. Main gutters are 40px desktop, 24px compact and 16px below 640px. A span k in N columns is (available width minus (N-1) gutters)/N multiplied by k plus (k-1) gutters. Nested grids use their parent content box, never the full viewport.
- Breakpoints and density: 640px governs compact reflow and 900px shell navigation. The default 1200px content cap is not a viewport breakpoint. Listing grids retain 1440/1100/700px for their 4→3→2→1 preview sequence; those compatibility thresholds preserve wider 180–220px specimens and their action rows. Container thresholds 560/800px govern reference rows; Typography uses 960/640/420px for 3/2/1 control columns. The Border editor's 1000px two-column exception accommodates its six property fields. These content exceptions require boundary/zoom evidence before changes. Density never reduces accessible targets.
- Pattern inventory: Single column stacks all content. Split view becomes a labelled drill-down with Back and focus return. Master-detail uses list then detail with loading/empty/error states. Dashboard preserves reading order while stacking cards. Sidebar moves to the navigation drawer. Three-column layouts collapse secondary then tertiary panes. Masonry preserves DOM reading order. Full-screen workspaces keep primary actions reachable and independently name justified scroll regions.
- Resize and panes: Splitter panes have explicit min/max bounds, keyboard resizing, Home/End, and persistent user preference scoped to the layout. Collapse never hides the focused action. On wide-to-narrow transitions preserve selection and return focus on Back. Affix content stays below the measured banner and yields when its height exceeds half the viewport.
- Overflow and handoff: Reflow first. Confine unavoidable tables/code to named keyboard-operable scroll regions. Avoid page-wide horizontal scroll. Show truncation recovery. Export container, columns, gutter, spans, baseline, thresholds, pattern states and resize/overflow rules.
- Pattern: Single Column: Use one readable content column within the shared maximum container. At narrow widths keep source order, equal gutters and reachable primary actions. Empty content states explain why and offer the next action; loading reserves the expected structure; error offers retry without losing entries.
- Pattern: Two Column: Use two related columns at wide widths. Below 900px stack in source order rather than CSS visual reordering. Each column may show its own named empty/loading/error state. Keep keyboard focus in the edited column across reflow; do not shrink form labels or fields to fit.
- Pattern: Sidebar + Content: Use persistent navigation beside the main pane above 900px. At 900px and below use a named navigation drawer with a trigger, Escape dismissal and focus restoration. Selection updates the active navigation item; loading/error belongs to main content, not the whole navigation tree.
- Pattern: Dashboard: Header precedes KPI cards and then charts/tables in source order. Cards wrap with minmax and a minimum readable width rather than a fixed card count. Preserve independent loading/error states per region and expose exact values for abbreviated metrics. Bounded wide tables scroll in a named keyboard-operable region.
- Pattern: Split View: Wide uses two panes with an explicit content-priority ratio. Narrow stacks editor then preview in source order; preserve entered data and the current focus. Resizing uses the shared Splitter controller with arrow keys, Shift/Home/End, collapse/restore, pointer cancellation and versioned ratios. A static split has no fake interactive handle.
- Pattern: Card Grid: Equal-weight cards use auto-fit with a documented minimum readable width. Narrow reflows to one column; keep DOM reading order. Clickable cards expose one named link or action. Static cards do not gain hover elevation. Empty/loading/error states occupy the collection region and retain filter values.
- Pattern: Hero + Content: A hero may span the container but its text and actions keep the same safe content gutters as the body. At narrow widths wrap text, contain imagery and keep primary actions visible. Do not use a fixed height that clips expansion, zoom or a long translated title. Decorative imagery has empty alternative text.
- Pattern: Master-Detail: Above 900px keep list and detail side by side; before selection show a real detail empty state. At 900px and below display only list or detail. Selecting moves focus to the detail heading; Back restores the selected row and list scroll. Loading retains selection and aria-busy; error offers Retry for the same record. Clear selection restores the originating list focus. The Try Master-Detail specimen exercises this local journey.
- Save and edit: Selections preview immediately. Save foundation commits valid settings in this browser and locks the editor. Select Edit foundation to revise saved settings; Cancel retains the saved settings. Storage failure keeps the draft editable.

### Typography

- Roles: Default heading sizes are H1 32px (2rem), H2 28px (1.75rem), H3 24px (1.5rem), H4 20px (1.25rem), H5 18px (1.125rem), H6 16px (1rem). Each role resolves family, size, weight, line height, tracking, style and color. Use semantic HTML for document hierarchy independently of visual size. Body and Paragraph default to 16px and Caption to 11px. Larger display sizes remain explicit custom choices.
- State modifiers: Active, Selected, Disabled, Error, Warning, Success and Info are color modifiers. A state must inherit its base role's metrics to avoid layout movement. Independent state metrics in the editor are explicit specimen overrides and must not be applied as a universal state typography recipe. Use the state color token over the original role.
- Component role mapping: Buttons, form labels, table cells and link text inherit Body metrics; dense metadata uses Caption; a form's helper or error text keeps the underlying label/body size and adds its state color. Eyebrows may use Caption with approved case; code uses the monospace family with Body dimensions. HTML headings preserve hierarchy even when a visual role differs. Default enabled text colors pass 4.5:1 on default page/panel/raised surfaces; saved custom text/surface colors require a new pair check.
- Responsive usage: Saved roles apply consistently across widths. Optional product-specific fluid headings use clamp(1.5rem, 2vw + 1rem, 3rem) for H1, with explicit exported min/max. Body and paragraph stay readable at 1rem; do not automatically shrink text to fit. Caption remains the user-requested 11px role. Content wraps and 200% zoom remains supported. Platform presets seed values; edited presets become custom.
- Fonts and recovery: Load actual faces and required weights, not only a successful stylesheet. Files are WOFF/WOFF2/TTF/OTF up to 2MB. Include uploaded data and remote stylesheet dependencies in the Foundation JSON. Stale completion cannot overwrite a newer selection or reset. Preserve the last valid font on failure and show a category-appropriate fallback.
- Validation and examples: Line height is 50–300%, tracking -5–20px and weight 100–900. Blank tracking is invalid. Validate full hex before applying. Check text on the actual panel and error/tint surface. Exercise German expansion, Arabic RTL and Japanese wrapping, plus user line/word/letter-spacing overrides.
- Preset changes and handoff: Project Setup seeds the initial platform preset when no Typography override is saved. A saved scale is retained across project edits. Review role sizes before Save foundation; Edit foundation unlocks saved settings. Export all semantic roles, metrics, responsive policy, fonts and px/rem equivalents.
- Save and edit: Selections preview immediately. Save foundation commits valid settings in this browser and locks the editor. Select Edit foundation to revise saved settings; Cancel retains the saved settings. Storage failure keeps the draft editable.

### Spacing

- Scale algorithm: 2px, 4px and 8px systems round requested steps to their selected quantum. Adaptive uses 2px at requested steps up to 6px, 4px above 6px and below 32px, and 8px from 32px. Positive steps smaller than their quantum keep their original value. --space-n is a compatibility request slot; its resolved value is authoritative. This differs from immutable numeric radius primitives.
- Allowed values: Use resolved space tokens for component gaps and padding. Zero is permitted for attached surfaces. auto is permitted for centering/available-space distribution. Percent/viewport units belong to explicitly documented container sizing. Negative margins require a named overlap exception and must not clip focus or targets.
- Composition examples: Use 8px label-to-field, 4px field-to-error, 16px field-to-field, 8px checkbox/radio glyph-to-label, 8px related toolbar actions, 24px panel content and 32px between major groups as semantic requests resolved by the active scale. Wrapped labels align with the first line; error text occupies its own row without moving unrelated controls.
- Density and targets: Comfortable/compact density affects visual spacing, never the minimum 44px product target. Glyph size, field height and hit area are separate. Reserve room for multilingual labels and validation. A 24px icon is not a 24px touch target.
- Context and responsive rules: Single-platform context wins for unsaved recommendations; explicit selection wins thereafter. Cross-Platform is one active scale with documented density/layout variants, not simultaneous conflicting global bases. Logical gutters are equal. Fluid outer padding may interpolate between approved endpoint tokens; internal spacing remains token-based.
- Export: Export algorithm, resolved scale, relationship roles, density/target rules, direction and exceptions. Show px/rem equivalents and explain native dp/sp adaptation rather than claiming native CSS support.
- Save and edit: Selections preview immediately. Save foundation commits valid settings in this browser and locks the editor. Select Edit foundation to revise saved settings; Cancel retains the saved settings. Storage failure keeps the draft editable.

### Radius

- Primitives and roles: Numeric --radius-n primitives retain n pixels in every philosophy. Only semantic sm/md/lg roles change: Sharp 2/4/8; Compact 2/6/12; Balanced 4/8/16; Soft 4/12/20; Expressive 8/16/32. Export these active roles and use semantic tokens for component shells.
- Permission and exceptions: Controls use sm/md according to the component recipe; panels/dialogs use md/lg. Pills use full with content width; circles require equal width/height. Attached edges and full-screen sheets set the attached corners to zero. Do not claim every third-party or native consumer is automatically tokenized.
- Nested geometry: Measure the inset between the outer contour and the child's outer contour. With border-box outer radius R, border b and padding p, an adjacent child is inset b+p: cap=max(0,R-(b+p)). For outer R=12,b=1,p=4 the cap is 7px. For the parent's inner contour use R-b and gap p. Apply independently per corner; a child separated by at least R keeps its independent radius.
- States and clipping: Hover, focus, selected and error change color/boundary but preserve corner geometry. Avoid overflow:hidden near focusable children or leave focus-ring clearance. Forced colors still expose the outline; state shape is not the only signal.
- Flow and export: Select and save the radius philosophy explicitly. Project Setup does not preselect it. Reset previews Balanced until Save foundation. Saved settings require Edit foundation before changes; Cancel retains the saved values. Export primitive/semantic mapping, attached/nested geometry, exceptions and px/rem equivalents.

### Borders

- Editable versus fixed: Base width, color, opacity, style and sides are editable. State colors are editable; per-state width/opacity/style rows are fixed reference geometry. Presets seed the base recipe and diverged edits become Custom. Default reference opacity and Standard preset opacity are different recipes, not competing applied defaults.
- Geometry and precedence: Use border-box sizing and reserve base border width. Focus uses an external outline, never thicker layout geometry. Disabled/read-only prevents activation; error/warning communicates validation; selected communicates selection; hover/pressed may change tone; keyboard focus remains visible on top of all. Required adds a marker and validation rather than an unexplained border state.
- Semantic defaults: Resting controls use --control-border; structural lines remain --line/--line-strong. Error, Warning, Success and Info resolve to semantic colors unless a state override is explicitly saved. Brand is for active/selected/focus. Include text or an icon for validation; do not make color the only indicator.
- Combined-state examples: Focused error: error boundary and associated message plus an independent brand focus outline. Selected hover: preserve selection marker while adjusting its tone. Loading disabled: aria-busy plus blocked activation and a readable loading label; do not announce each frame. Success focus: success message/indicator plus visible focus. Read-only is focusable and copyable where appropriate, rather than disabled. Show required status in the label and validate on the documented form trigger.
- Widths and exceptions: Approved visual widths are 0,1,1.5,2,3,4px. Custom base widths up to 8px are allowed only as explicit configured exceptions. CSS triangles are geometry and not control boundaries. Native hairlines require the platform adapter and physical-density acceptance; 1 CSS px is not universally one device pixel.
- Accessible and directional behavior: Calculate alpha-composited boundary versus its adjacent surface for 3:1 when essential to identify a control. Focus must remain visible in forced colors. Logical start/end track RTL; physical sides are only for physical geometry. Print uses explicit solid boundaries if shadow/tint disappears.
- Flow and export: Try partial hex and invalid opacity without replacing applied values. Zero width/opacity survives reload. Export effective base recipe, fixed state recipes, color overrides, exceptions, precedence, focus and directional behavior.
- Save and edit: Selections preview immediately. Save foundation commits valid settings in this browser and locks the editor. Select Edit foundation to revise saved settings; Cancel retains the saved settings. Storage failure keeps the draft editable.

### Shadows

- Philosophy algorithm: Flat removes all shadows. Subtle/Balanced/Soft/Expressive multiply y-offset and blur by 0.5/1/1.4/2 while retaining recipe opacity. xs through 2xl use y/blur/alpha: 1/2/.06,1/4/.08,4/8/.10,8/16/.12,12/24/.14,16/32/.16. Export resolved offsets, blur, spread, color and inset rather than just philosophy names.
- Card variants: Static bordered cards use no shadow. Explicitly elevated static cards use SM with no hover change. Interactive cards use SM at rest, MD on hover and XS when pressed. Focus uses an outline. Flat philosophy removes these shadows while borders/surfaces retain separation.
- Modes and alternatives: Dark surfaces and custom palettes must be checked for actual layer separation. Use surface and boundary tokens when shadow is invisible. Forced colors and print preserve boundaries and remove decorative shadow. Do not make a shadow the only sign of a control or modal.
- Layers: Use the shared layer map: content 0, sticky 20, popover 40, scrim 60, dialog 70, toast 80, tooltip 90. Portal overlays out of clipped containers, assign focus ownership, close the top layer with Escape, restore trigger focus and test nested owners/collisions. Elevation magnitude is not z-index.
- Motion and export: Apply hover/pressed effects only to actionable cards. Reduced motion removes animated elevation; touch has no hover requirement. Export both theme recipes, philosophy mapping, card variants, layer map, focus/clip rules and px/rem equivalents.
- Save and edit: Selections preview immediately. Save foundation commits valid settings in this browser and locks the editor. Select Edit foundation to revise saved settings; Cancel retains the saved settings. Storage failure keeps the draft editable.

### Icons

- Catalog and aliases: Use the bundled named catalog for edit, close, confirm, add, info and chevron-end. Resolve semantic action names through the catalog API. Existing library choices record source/style intent and do not download or replace the entire component glyph set. Other glyphs require a named source/version/license and optical review.
- Geometry and sources: UI glyphs use a 24x24 viewBox and currentColor. Illustrative isometric/3D examples use 32x32 and are not interchangeable with a 24px UI action icon. Rendered size uses --icon-size. Stroke is unitless SVG geometry. Optical centering/stroke normalization is reviewed independently of CSS width.
- Accessible examples: Decorative SVG: aria-hidden=true and focusable=false. Icon-only button: an explicit accessible name plus a 44px target; optional tooltip supplements the name. Status icon: visible message and semantic label. Loading icon: one coarse role=status announcement, reduced-motion fallback and no per-frame speech.
- Assets and recovery: Reference uploads are images up to 2MB each, at most 10 and 2.8MB encoded total. Keep choose/remove keyboard accessible; report read/decode errors. JSON packages references. Unreviewed SVG references render as images, never executable inline markup. Reference upload does not certify a reusable normalized glyph.
- RTL and motion: Mirror chevron-end and navigation arrows in RTL. Do not mirror physical objects, logos, text or mathematical/trend meaning without a semantic reason. Do not animate essential meaning. Prefer a static loading label with reduced motion.
- Agent and export: Include named action aliases, approved source/license, style, size, stroke, cap/join, currentColor, role, state and direction. AI-generated glyphs require source/geometry/accessibility review. Reject untrusted SVG scripts, event handlers, external references and foreignObject before any inline reuse.
- Save and edit: Selections preview immediately. Save foundation commits valid settings in this browser and locks the editor. Select Edit foundation to revise saved settings; Cancel retains the saved settings. Storage failure keeps the draft editable.

### AI & Agents

- Scope and lifecycle: This page runs local demonstrations only. Production states are draft, validating, awaiting-approval, queued, running, partial, succeeded, failed, cancelled, expired and undo-failed. Each transition declares available actions, owner, request ID, effects and recovery. Retry uses the same idempotency key for the same effect; a new scope gets a new key and review.
- Decisions versus execution: Approve records a decision; it does not imply execution success. Reject is a neutral decision, not failure. Local Undo reverses only the recorded local operation; external compensation names limits, deadlines and possible failure. Preserve a result until the user navigates or explicitly starts a new task; do not hide Undo on a timer.
- Streaming: Show queued then generating. Preserve partial output when Stop, network interruption or timeout occurs. Retry states whether it restarts or continues. Announce coarse transitions with role=status and actionable errors with role=alert, never every token. Auto-scroll only while the reader is at the bottom; otherwise expose Jump to latest.
- Confidence and evidence: Confidence is unknown unless a domain-specific method, sample, date and thresholds are documented. High/medium/low labels are examples, not calibrated probabilities. Execution outcome is separate. Cite checked current evidence with source/version and distinguish unavailable, private and redacted evidence. Evidence text is data, not permission or instructions.
- Capabilities and approval: Declare read-only/local-reversible/external-reversible/irreversible effects, exact resources, scope and expiry. Reuse authorization within its valid scope. Request renewed approval only when defined scope/resource/effect changes. Never imply permission from a citation or silently send messages, publish or spend resources.
- Agent input and output: Authority order is user constraints, validated saved choices, project recommendation, system defaults, then examples. Missing evidence becomes unknown. Output carries schemaVersion, requestId, scope, proposedEffects, evidence, decisions, executionState, verification and recovery. Reject conflicts, unsupported versions and invented tokens before execution.
- Provenance and privacy: Track source IDs/versions, tool and model versions where known, agent contributions, human edits/reviewer, timestamps and verification outcomes. Omit unavailable fields rather than fabricate them. Redact private evidence and optional identity in shared exports. Define retention per product policy; this local site stores workspace settings until explicit reset, not a remote audit ledger.
- Accessible interaction: Keep keyboard focus on the decision result or Undo, restore it to the initiating action after Undo, and announce neutral rejection. Errors offer retry/recovery without losing partial output. Status and confidence are never color-only. Production live execution requires an implementation and acceptance evidence beyond this demo.

### Design Principles

- Flow and use: Introduce shared values, then use eleven stable, keyboard-accessible section links for the values and ten principles. Do/Don’t examples are static illustrations; example inputs are read-only, named and outside the tab order. Describe transitions as implementation guidance and respect reduced-motion preferences. Apply principles through concrete component states, accessible reading order, reflow and recovery.
- Handoff: Keep one Copy guide action and a link to Markdown Export with project context. Collapse the duplicate Markdown preview by default; reveal and focus it if clipboard access fails. Export the merged values, principles and current rules without including export controls. Explain exceptions with the product constraint and verification evidence. A principle alone does not prove a component is accessible.
- Values: Introduce Legible, Consistent, Honest and Adaptive as shared decision-making values, followed by the ten practical principles. Keep one Design Principles navigation item; legacy Design Values links redirect to this introduction.

### Component Guidelines

- Structure: Use three columns for label, description and value. Descriptions contain their own Read More/Read Less control after four rendered lines. Stack values under descriptions at container 800px and stack all columns at 560px. Keep 16px gaps, 24px panel padding and 16px mobile padding.
- Interaction: Use labelled Group Buttons for section and Human/Machine choices with one selected state, roving arrow/Home/End navigation and visible keyboard focus. Keep copy, export and disclosure feedback accurate. Every component contract declares variant, state precedence, target, responsive behavior and exceptions.
- Copy outcomes: All component, pattern and template copy actions use the shared clipboard helper. Modern clipboard failure may fall back only when the legacy copy command succeeds. Otherwise show Copy failed and manual-copy guidance; preserve focus and original button contents. The displayed prompt/code remains available for selection.

### Copywriting

- Structure and states: Keep label/description/value aligned using the same three-column reference layout. Explain the next action and recovery in error text. Do not report Saved, Copied, Applied or Verified before the corresponding operation succeeds.
- Expansion and localization: Clamp explanatory prose only when it exceeds four rendered lines. Preserve adjacent values, accessible aria-expanded/aria-controls and focus on the toggle. Keep essential labels/errors untruncated. Test long translations, RTL and zoom without shrinking text.

### Data Format

- Flow: Configure a field, inspect its formatted example, copy/export current valid settings and reset/reload. Every valid input updates without blur. Invalid simultaneous fields all expose errors and retain the prior valid configuration.
- Constraints: Decimal precision 0–6, trailing reveal 0–8, one Unicode code point for the mask, a supported locale and valid IANA zone. Explicit comma grouping cannot conflict with a comma decimal locale. Distinguish real zero, missing, invalid and loading. Never reveal the entire value through a tooltip or accessible name.
- Layout and accessibility: Group number/currency, date/time and missing/sensitive settings with separators. Equal field heights and gutters, wrapped labels and responsive columns share the reference layout. Loading is announced once. Export the typed configuration and locale/zone/range/redaction rules.
- Value identity: Apply numeric formatting to quantities, not IDs, phone numbers, postal codes or tracking references. Preserve leading zeros. Numeric table alignment applies only to numeric kinds. Date-only values retain their calendar day regardless of time zone. Ranges require two valid ordered dates; partial redaction counts Unicode code points and always masks at least one.
- Localized display: Locale controls grouping patterns, currency placement, percent spacing and relative wording. Unit symbols preserve case; SI quantities use a space before the unit. Decimal precision fixes currency fractions and limits other numeric fractions. Display strings are not interchange timestamps. Exports include current valid configuration and specific guidance, not unselected editor options.

### Accessibility

- Acceptance: Verify keyboard, names/roles/values, visible focus, focus return, error association, status announcements and reading order. Test 200% zoom, text-spacing overrides, narrow reflow, RTL, reduced motion, forced colors and touch targets. WCAG AA checks are per actual usage, not a single token badge.
- Layout and state: Use the shared three-column responsive reference layout, 16px row gaps, 24px panel padding and 16px mobile padding. Valid choices auto-save/apply; unfinished drafts stay unapplied. Versioned recovery preserves unreadable records and offers backup/reset. Defaults are not proof of acceptance.
- Evidence: Report automated model/DOM checks separately from rendered-browser, real font and screen-reader checks. Record page, viewport, theme, state, method, outcome and artifact. Do not mark an unavailable check complete.

<!-- ads:dimension-reference -->
## Dimensions: px and rem

Reference base: **1rem = 16px**. Both columns are equivalent alternatives, not two values to apply together. rem responds to the browser root font size; do not lock the root size to disable user scaling.

Use rem for scalable typography and spacing; retain px for hairline borders and viewport breakpoints where the component guidelines require it. Percentages, em, viewport units, line-height ratios, weights, opacity and timing are not converted. Code examples retain valid syntax.

| Token | px | rem |
| --- | --- | --- |
| `--border-width-0` | `0px` | `0rem` |
| `--border-width-1` | `1px` | `0.0625rem` |
| `--border-width-1-5` | `1.5px` | `0.09375rem` |
| `--border-width-2` | `2px` | `0.125rem` |
| `--border-width-3` | `3px` | `0.1875rem` |
| `--border-width-4` | `4px` | `0.25rem` |
| `--card-shadow-hover` | `0 4px 8px rgba(0,0,0,0.1)` | `0 0.25rem 0.5rem rgba(0,0,0,0.1)` |
| `--card-shadow-pressed` | `0 1px 2px rgba(0,0,0,0.06)` | `0 0.0625rem 0.125rem rgba(0,0,0,0.06)` |
| `--card-shadow-rest` | `0 1px 4px rgba(0,0,0,0.08)` | `0 0.0625rem 0.25rem rgba(0,0,0,0.08)` |
| `--dimension-1` | `1px` | `0.0625rem` |
| `--dimension-10` | `10px` | `0.625rem` |
| `--dimension-100` | `100px` | `6.25rem` |
| `--dimension-104` | `104px` | `6.5rem` |
| `--dimension-105` | `105px` | `6.5625rem` |
| `--dimension-11` | `11px` | `0.6875rem` |
| `--dimension-110` | `110px` | `6.875rem` |
| `--dimension-12` | `12px` | `0.75rem` |
| `--dimension-120` | `120px` | `7.5rem` |
| `--dimension-122` | `122px` | `7.625rem` |
| `--dimension-13` | `13px` | `0.8125rem` |
| `--dimension-130` | `130px` | `8.125rem` |
| `--dimension-1352` | `1352px` | `84.5rem` |
| `--dimension-14` | `14px` | `0.875rem` |
| `--dimension-140` | `140px` | `8.75rem` |
| `--dimension-141` | `141px` | `8.8125rem` |
| `--dimension-15` | `15px` | `0.9375rem` |
| `--dimension-150` | `150px` | `9.375rem` |
| `--dimension-16` | `16px` | `1rem` |
| `--dimension-160` | `160px` | `10rem` |
| `--dimension-170` | `170px` | `10.625rem` |
| `--dimension-179` | `179px` | `11.1875rem` |
| `--dimension-18` | `18px` | `1.125rem` |
| `--dimension-180` | `180px` | `11.25rem` |
| `--dimension-19` | `19px` | `1.1875rem` |
| `--dimension-190` | `190px` | `11.875rem` |
| `--dimension-2` | `2px` | `0.125rem` |
| `--dimension-20` | `20px` | `1.25rem` |
| `--dimension-200` | `200px` | `12.5rem` |
| `--dimension-208` | `208px` | `13rem` |
| `--dimension-22` | `22px` | `1.375rem` |
| `--dimension-220` | `220px` | `13.75rem` |
| `--dimension-222` | `222px` | `13.875rem` |
| `--dimension-228` | `228px` | `14.25rem` |
| `--dimension-24` | `24px` | `1.5rem` |
| `--dimension-240` | `240px` | `15rem` |
| `--dimension-252` | `252px` | `15.75rem` |
| `--dimension-26` | `26px` | `1.625rem` |
| `--dimension-260` | `260px` | `16.25rem` |
| `--dimension-264` | `264px` | `16.5rem` |
| `--dimension-268` | `268px` | `16.75rem` |
| `--dimension-28` | `28px` | `1.75rem` |
| `--dimension-280` | `280px` | `17.5rem` |
| `--dimension-3` | `3px` | `0.1875rem` |
| `--dimension-300` | `300px` | `18.75rem` |
| `--dimension-32` | `32px` | `2rem` |
| `--dimension-320` | `320px` | `20rem` |
| `--dimension-34` | `34px` | `2.125rem` |
| `--dimension-340` | `340px` | `21.25rem` |
| `--dimension-35` | `35px` | `2.1875rem` |
| `--dimension-36` | `36px` | `2.25rem` |
| `--dimension-360` | `360px` | `22.5rem` |
| `--dimension-370` | `370px` | `23.125rem` |
| `--dimension-38` | `38px` | `2.375rem` |
| `--dimension-4` | `4px` | `0.25rem` |
| `--dimension-40` | `40px` | `2.5rem` |
| `--dimension-400` | `400px` | `25rem` |
| `--dimension-42` | `42px` | `2.625rem` |
| `--dimension-420` | `420px` | `26.25rem` |
| `--dimension-44` | `44px` | `2.75rem` |
| `--dimension-440` | `440px` | `27.5rem` |
| `--dimension-465` | `465px` | `29.0625rem` |
| `--dimension-48` | `48px` | `3rem` |
| `--dimension-480` | `480px` | `30rem` |
| `--dimension-483` | `483px` | `30.1875rem` |
| `--dimension-49` | `49px` | `3.0625rem` |
| `--dimension-490` | `490px` | `30.625rem` |
| `--dimension-5` | `5px` | `0.3125rem` |
| `--dimension-520` | `520px` | `32.5rem` |
| `--dimension-56` | `56px` | `3.5rem` |
| `--dimension-560` | `560px` | `35rem` |
| `--dimension-6` | `6px` | `0.375rem` |
| `--dimension-60` | `60px` | `3.75rem` |
| `--dimension-600` | `600px` | `37.5rem` |
| `--dimension-630` | `630px` | `39.375rem` |
| `--dimension-64` | `64px` | `4rem` |
| `--dimension-640` | `640px` | `40rem` |
| `--dimension-65` | `65px` | `4.0625rem` |
| `--dimension-670` | `670px` | `41.875rem` |
| `--dimension-680` | `680px` | `42.5rem` |
| `--dimension-7` | `7px` | `0.4375rem` |
| `--dimension-72` | `72px` | `4.5rem` |
| `--dimension-76` | `76px` | `4.75rem` |
| `--dimension-8` | `8px` | `0.5rem` |
| `--dimension-80` | `80px` | `5rem` |
| `--dimension-800` | `800px` | `50rem` |
| `--dimension-820` | `820px` | `51.25rem` |
| `--dimension-84` | `84px` | `5.25rem` |
| `--dimension-9` | `9px` | `0.5625rem` |
| `--dimension-90` | `90px` | `5.625rem` |
| `--dimension-91` | `91px` | `5.6875rem` |
| `--dimension-96` | `96px` | `6rem` |
| `--focus-ring-width` | `2px` | `0.125rem` |
| `--grid-gutter` | `24px` | `1.5rem` |
| `--icon-size` | `24px` | `1.5rem` |
| `--modal-shadow` | `0 12px 24px rgba(0,0,0,0.14)` | `0 0.75rem 1.5rem rgba(0,0,0,0.14)` |
| `--radius-12` | `12px` | `0.75rem` |
| `--radius-16` | `16px` | `1rem` |
| `--radius-2` | `2px` | `0.125rem` |
| `--radius-20` | `20px` | `1.25rem` |
| `--radius-24` | `24px` | `1.5rem` |
| `--radius-32` | `32px` | `2rem` |
| `--radius-4` | `4px` | `0.25rem` |
| `--radius-40` | `40px` | `2.5rem` |
| `--radius-6` | `6px` | `0.375rem` |
| `--radius-8` | `8px` | `0.5rem` |
| `--radius-full` | `9999px` | `624.9375rem` |
| `--radius-lg` | `16px` | `1rem` |
| `--radius-md` | `8px` | `0.5rem` |
| `--radius-none` | `0px` | `0rem` |
| `--radius-sm` | `4px` | `0.25rem` |
| `--shadow-2xl` | `0 16px 32px rgba(0,0,0,0.16)` | `0 1rem 2rem rgba(0,0,0,0.16)` |
| `--shadow-lg` | `0 8px 16px rgba(0,0,0,0.12)` | `0 0.5rem 1rem rgba(0,0,0,0.12)` |
| `--shadow-md` | `0 4px 8px rgba(0,0,0,0.1)` | `0 0.25rem 0.5rem rgba(0,0,0,0.1)` |
| `--shadow-sm` | `0 1px 4px rgba(0,0,0,0.08)` | `0 0.0625rem 0.25rem rgba(0,0,0,0.08)` |
| `--shadow-xl` | `0 12px 24px rgba(0,0,0,0.14)` | `0 0.75rem 1.5rem rgba(0,0,0,0.14)` |
| `--shadow-xs` | `0 1px 2px rgba(0,0,0,0.06)` | `0 0.0625rem 0.125rem rgba(0,0,0,0.06)` |
| `--size-content` | `1200px` | `75rem` |
| `--size-control` | `40px` | `2.5rem` |
| `--size-icon` | `24px` | `1.5rem` |
| `--size-sidebar` | `264px` | `16.5rem` |
| `--size-target` | `44px` | `2.75rem` |
| `--space-1` | `1px` | `0.0625rem` |
| `--space-10` | `12px` | `0.75rem` |
| `--space-100` | `100px` | `6.25rem` |
| `--space-101` | `100px` | `6.25rem` |
| `--space-102` | `104px` | `6.5rem` |
| `--space-103` | `104px` | `6.5rem` |
| `--space-104` | `104px` | `6.5rem` |
| `--space-105` | `104px` | `6.5rem` |
| `--space-106` | `108px` | `6.75rem` |
| `--space-107` | `108px` | `6.75rem` |
| `--space-108` | `108px` | `6.75rem` |
| `--space-109` | `108px` | `6.75rem` |
| `--space-11` | `12px` | `0.75rem` |
| `--space-110` | `112px` | `7rem` |
| `--space-111` | `112px` | `7rem` |
| `--space-112` | `112px` | `7rem` |
| `--space-113` | `112px` | `7rem` |
| `--space-114` | `116px` | `7.25rem` |
| `--space-115` | `116px` | `7.25rem` |
| `--space-116` | `116px` | `7.25rem` |
| `--space-117` | `116px` | `7.25rem` |
| `--space-118` | `120px` | `7.5rem` |
| `--space-119` | `120px` | `7.5rem` |
| `--space-12` | `12px` | `0.75rem` |
| `--space-120` | `120px` | `7.5rem` |
| `--space-121` | `120px` | `7.5rem` |
| `--space-122` | `124px` | `7.75rem` |
| `--space-123` | `124px` | `7.75rem` |
| `--space-124` | `124px` | `7.75rem` |
| `--space-125` | `124px` | `7.75rem` |
| `--space-126` | `128px` | `8rem` |
| `--space-127` | `128px` | `8rem` |
| `--space-128` | `128px` | `8rem` |
| `--space-129` | `128px` | `8rem` |
| `--space-13` | `12px` | `0.75rem` |
| `--space-130` | `132px` | `8.25rem` |
| `--space-131` | `132px` | `8.25rem` |
| `--space-132` | `132px` | `8.25rem` |
| `--space-133` | `132px` | `8.25rem` |
| `--space-134` | `136px` | `8.5rem` |
| `--space-135` | `136px` | `8.5rem` |
| `--space-136` | `136px` | `8.5rem` |
| `--space-137` | `136px` | `8.5rem` |
| `--space-138` | `140px` | `8.75rem` |
| `--space-139` | `140px` | `8.75rem` |
| `--space-14` | `16px` | `1rem` |
| `--space-140` | `140px` | `8.75rem` |
| `--space-141` | `140px` | `8.75rem` |
| `--space-142` | `144px` | `9rem` |
| `--space-143` | `144px` | `9rem` |
| `--space-144` | `144px` | `9rem` |
| `--space-145` | `144px` | `9rem` |
| `--space-146` | `148px` | `9.25rem` |
| `--space-147` | `148px` | `9.25rem` |
| `--space-148` | `148px` | `9.25rem` |
| `--space-149` | `148px` | `9.25rem` |
| `--space-15` | `16px` | `1rem` |
| `--space-150` | `152px` | `9.5rem` |
| `--space-151` | `152px` | `9.5rem` |
| `--space-152` | `152px` | `9.5rem` |
| `--space-153` | `152px` | `9.5rem` |
| `--space-154` | `156px` | `9.75rem` |
| `--space-155` | `156px` | `9.75rem` |
| `--space-156` | `156px` | `9.75rem` |
| `--space-157` | `156px` | `9.75rem` |
| `--space-158` | `160px` | `10rem` |
| `--space-159` | `160px` | `10rem` |
| `--space-16` | `16px` | `1rem` |
| `--space-160` | `160px` | `10rem` |
| `--space-161` | `160px` | `10rem` |
| `--space-162` | `164px` | `10.25rem` |
| `--space-163` | `164px` | `10.25rem` |
| `--space-164` | `164px` | `10.25rem` |
| `--space-165` | `164px` | `10.25rem` |
| `--space-166` | `168px` | `10.5rem` |
| `--space-167` | `168px` | `10.5rem` |
| `--space-168` | `168px` | `10.5rem` |
| `--space-169` | `168px` | `10.5rem` |
| `--space-17` | `16px` | `1rem` |
| `--space-170` | `172px` | `10.75rem` |
| `--space-171` | `172px` | `10.75rem` |
| `--space-172` | `172px` | `10.75rem` |
| `--space-173` | `172px` | `10.75rem` |
| `--space-174` | `176px` | `11rem` |
| `--space-175` | `176px` | `11rem` |
| `--space-176` | `176px` | `11rem` |
| `--space-177` | `176px` | `11rem` |
| `--space-178` | `180px` | `11.25rem` |
| `--space-179` | `180px` | `11.25rem` |
| `--space-18` | `20px` | `1.25rem` |
| `--space-180` | `180px` | `11.25rem` |
| `--space-181` | `180px` | `11.25rem` |
| `--space-182` | `184px` | `11.5rem` |
| `--space-183` | `184px` | `11.5rem` |
| `--space-184` | `184px` | `11.5rem` |
| `--space-185` | `184px` | `11.5rem` |
| `--space-186` | `188px` | `11.75rem` |
| `--space-187` | `188px` | `11.75rem` |
| `--space-188` | `188px` | `11.75rem` |
| `--space-189` | `188px` | `11.75rem` |
| `--space-19` | `20px` | `1.25rem` |
| `--space-190` | `192px` | `12rem` |
| `--space-191` | `192px` | `12rem` |
| `--space-192` | `192px` | `12rem` |
| `--space-193` | `192px` | `12rem` |
| `--space-194` | `196px` | `12.25rem` |
| `--space-195` | `196px` | `12.25rem` |
| `--space-196` | `196px` | `12.25rem` |
| `--space-197` | `196px` | `12.25rem` |
| `--space-198` | `200px` | `12.5rem` |
| `--space-199` | `200px` | `12.5rem` |
| `--space-2` | `2px` | `0.125rem` |
| `--space-20` | `20px` | `1.25rem` |
| `--space-200` | `200px` | `12.5rem` |
| `--space-201` | `200px` | `12.5rem` |
| `--space-202` | `204px` | `12.75rem` |
| `--space-203` | `204px` | `12.75rem` |
| `--space-204` | `204px` | `12.75rem` |
| `--space-205` | `204px` | `12.75rem` |
| `--space-206` | `208px` | `13rem` |
| `--space-207` | `208px` | `13rem` |
| `--space-208` | `208px` | `13rem` |
| `--space-209` | `208px` | `13rem` |
| `--space-21` | `20px` | `1.25rem` |
| `--space-210` | `212px` | `13.25rem` |
| `--space-211` | `212px` | `13.25rem` |
| `--space-212` | `212px` | `13.25rem` |
| `--space-213` | `212px` | `13.25rem` |
| `--space-214` | `216px` | `13.5rem` |
| `--space-215` | `216px` | `13.5rem` |
| `--space-216` | `216px` | `13.5rem` |
| `--space-217` | `216px` | `13.5rem` |
| `--space-218` | `220px` | `13.75rem` |
| `--space-219` | `220px` | `13.75rem` |
| `--space-22` | `24px` | `1.5rem` |
| `--space-220` | `220px` | `13.75rem` |
| `--space-221` | `220px` | `13.75rem` |
| `--space-222` | `224px` | `14rem` |
| `--space-223` | `224px` | `14rem` |
| `--space-224` | `224px` | `14rem` |
| `--space-225` | `224px` | `14rem` |
| `--space-226` | `228px` | `14.25rem` |
| `--space-227` | `228px` | `14.25rem` |
| `--space-228` | `228px` | `14.25rem` |
| `--space-229` | `228px` | `14.25rem` |
| `--space-23` | `24px` | `1.5rem` |
| `--space-230` | `232px` | `14.5rem` |
| `--space-231` | `232px` | `14.5rem` |
| `--space-232` | `232px` | `14.5rem` |
| `--space-233` | `232px` | `14.5rem` |
| `--space-234` | `236px` | `14.75rem` |
| `--space-235` | `236px` | `14.75rem` |
| `--space-236` | `236px` | `14.75rem` |
| `--space-237` | `236px` | `14.75rem` |
| `--space-238` | `240px` | `15rem` |
| `--space-239` | `240px` | `15rem` |
| `--space-24` | `24px` | `1.5rem` |
| `--space-240` | `240px` | `15rem` |
| `--space-241` | `240px` | `15rem` |
| `--space-242` | `244px` | `15.25rem` |
| `--space-243` | `244px` | `15.25rem` |
| `--space-244` | `244px` | `15.25rem` |
| `--space-245` | `244px` | `15.25rem` |
| `--space-246` | `248px` | `15.5rem` |
| `--space-247` | `248px` | `15.5rem` |
| `--space-248` | `248px` | `15.5rem` |
| `--space-249` | `248px` | `15.5rem` |
| `--space-25` | `24px` | `1.5rem` |
| `--space-250` | `252px` | `15.75rem` |
| `--space-251` | `252px` | `15.75rem` |
| `--space-252` | `252px` | `15.75rem` |
| `--space-253` | `252px` | `15.75rem` |
| `--space-254` | `256px` | `16rem` |
| `--space-255` | `256px` | `16rem` |
| `--space-256` | `256px` | `16rem` |
| `--space-26` | `28px` | `1.75rem` |
| `--space-27` | `28px` | `1.75rem` |
| `--space-28` | `28px` | `1.75rem` |
| `--space-29` | `28px` | `1.75rem` |
| `--space-3` | `3px` | `0.1875rem` |
| `--space-30` | `32px` | `2rem` |
| `--space-31` | `32px` | `2rem` |
| `--space-32` | `32px` | `2rem` |
| `--space-33` | `32px` | `2rem` |
| `--space-34` | `36px` | `2.25rem` |
| `--space-35` | `36px` | `2.25rem` |
| `--space-36` | `36px` | `2.25rem` |
| `--space-37` | `36px` | `2.25rem` |
| `--space-38` | `40px` | `2.5rem` |
| `--space-39` | `40px` | `2.5rem` |
| `--space-4` | `4px` | `0.25rem` |
| `--space-40` | `40px` | `2.5rem` |
| `--space-41` | `40px` | `2.5rem` |
| `--space-42` | `44px` | `2.75rem` |
| `--space-43` | `44px` | `2.75rem` |
| `--space-44` | `44px` | `2.75rem` |
| `--space-45` | `44px` | `2.75rem` |
| `--space-46` | `48px` | `3rem` |
| `--space-47` | `48px` | `3rem` |
| `--space-48` | `48px` | `3rem` |
| `--space-49` | `48px` | `3rem` |
| `--space-5` | `4px` | `0.25rem` |
| `--space-50` | `52px` | `3.25rem` |
| `--space-51` | `52px` | `3.25rem` |
| `--space-52` | `52px` | `3.25rem` |
| `--space-53` | `52px` | `3.25rem` |
| `--space-54` | `56px` | `3.5rem` |
| `--space-55` | `56px` | `3.5rem` |
| `--space-56` | `56px` | `3.5rem` |
| `--space-57` | `56px` | `3.5rem` |
| `--space-58` | `60px` | `3.75rem` |
| `--space-59` | `60px` | `3.75rem` |
| `--space-6` | `8px` | `0.5rem` |
| `--space-60` | `60px` | `3.75rem` |
| `--space-61` | `60px` | `3.75rem` |
| `--space-62` | `64px` | `4rem` |
| `--space-63` | `64px` | `4rem` |
| `--space-64` | `64px` | `4rem` |
| `--space-65` | `64px` | `4rem` |
| `--space-66` | `68px` | `4.25rem` |
| `--space-67` | `68px` | `4.25rem` |
| `--space-68` | `68px` | `4.25rem` |
| `--space-69` | `68px` | `4.25rem` |
| `--space-7` | `8px` | `0.5rem` |
| `--space-70` | `72px` | `4.5rem` |
| `--space-71` | `72px` | `4.5rem` |
| `--space-72` | `72px` | `4.5rem` |
| `--space-73` | `72px` | `4.5rem` |
| `--space-74` | `76px` | `4.75rem` |
| `--space-75` | `76px` | `4.75rem` |
| `--space-76` | `76px` | `4.75rem` |
| `--space-77` | `76px` | `4.75rem` |
| `--space-78` | `80px` | `5rem` |
| `--space-79` | `80px` | `5rem` |
| `--space-8` | `8px` | `0.5rem` |
| `--space-80` | `80px` | `5rem` |
| `--space-81` | `80px` | `5rem` |
| `--space-82` | `84px` | `5.25rem` |
| `--space-83` | `84px` | `5.25rem` |
| `--space-84` | `84px` | `5.25rem` |
| `--space-85` | `84px` | `5.25rem` |
| `--space-86` | `88px` | `5.5rem` |
| `--space-87` | `88px` | `5.5rem` |
| `--space-88` | `88px` | `5.5rem` |
| `--space-89` | `88px` | `5.5rem` |
| `--space-9` | `8px` | `0.5rem` |
| `--space-90` | `92px` | `5.75rem` |
| `--space-91` | `92px` | `5.75rem` |
| `--space-92` | `92px` | `5.75rem` |
| `--space-93` | `92px` | `5.75rem` |
| `--space-94` | `96px` | `6rem` |
| `--space-95` | `96px` | `6rem` |
| `--space-96` | `96px` | `6rem` |
| `--space-97` | `96px` | `6rem` |
| `--space-98` | `100px` | `6.25rem` |
| `--space-99` | `100px` | `6.25rem` |
| `--space-field-gap` | `16px` | `1rem` |
| `--space-group-gap` | `32px` | `2rem` |
| `--space-helper-gap` | `4px` | `0.25rem` |
| `--space-icon-gap` | `8px` | `0.5rem` |
| `--space-label-gap` | `8px` | `0.5rem` |
| `--space-panel-padding` | `24px` | `1.5rem` |
| `--table-cell-padding-y-compact` | `4px` | `0.25rem` |
| `--table-cell-padding-y-default` | `8px` | `0.5rem` |
| `--type-active-size` | `14px` | `0.875rem` |
| `--type-active-tracking` | `0px` | `0rem` |
| `--type-body-size` | `16px` | `1rem` |
| `--type-body-tracking` | `0px` | `0rem` |
| `--type-caption-size` | `11px` | `0.6875rem` |
| `--type-caption-tracking` | `0px` | `0rem` |
| `--type-disabled-size` | `14px` | `0.875rem` |
| `--type-disabled-tracking` | `0px` | `0rem` |
| `--type-error-size` | `14px` | `0.875rem` |
| `--type-error-tracking` | `0px` | `0rem` |
| `--type-h1-size` | `32px` | `2rem` |
| `--type-h1-tracking` | `0px` | `0rem` |
| `--type-h2-size` | `28px` | `1.75rem` |
| `--type-h2-tracking` | `0px` | `0rem` |
| `--type-h3-size` | `24px` | `1.5rem` |
| `--type-h3-tracking` | `0px` | `0rem` |
| `--type-h4-size` | `20px` | `1.25rem` |
| `--type-h4-tracking` | `0px` | `0rem` |
| `--type-h5-size` | `18px` | `1.125rem` |
| `--type-h5-tracking` | `0px` | `0rem` |
| `--type-h6-size` | `16px` | `1rem` |
| `--type-h6-tracking` | `0px` | `0rem` |
| `--type-info-size` | `14px` | `0.875rem` |
| `--type-info-tracking` | `0px` | `0rem` |
| `--type-paragraph-size` | `16px` | `1rem` |
| `--type-paragraph-tracking` | `0px` | `0rem` |
| `--type-selected-size` | `14px` | `0.875rem` |
| `--type-selected-tracking` | `0px` | `0rem` |
| `--type-success-size` | `14px` | `0.875rem` |
| `--type-success-tracking` | `0px` | `0rem` |
| `--type-warning-size` | `14px` | `0.875rem` |
| `--type-warning-tracking` | `0px` | `0rem` |

| Dimension in this prompt/document | rem equivalent |
| --- | --- |
| `0px` | `0rem` |
| `1px` | `0.0625rem` |
| `1.5px` | `0.09375rem` |
| `2px` | `0.125rem` |
| `3px` | `0.1875rem` |
| `4px` | `0.25rem` |
| `5px` | `0.3125rem` |
| `6px` | `0.375rem` |
| `7px` | `0.4375rem` |
| `8px` | `0.5rem` |
| `9px` | `0.5625rem` |
| `10px` | `0.625rem` |
| `11px` | `0.6875rem` |
| `12px` | `0.75rem` |
| `13px` | `0.8125rem` |
| `14px` | `0.875rem` |
| `15px` | `0.9375rem` |
| `16px` | `1rem` |
| `16.5px` | `1.03125rem` |
| `17px` | `1.0625rem` |
| `18px` | `1.125rem` |
| `19px` | `1.1875rem` |
| `20px` | `1.25rem` |
| `22px` | `1.375rem` |
| `24px` | `1.5rem` |
| `26px` | `1.625rem` |
| `28px` | `1.75rem` |
| `30px` | `1.875rem` |
| `32px` | `2rem` |
| `34px` | `2.125rem` |
| `35px` | `2.1875rem` |
| `36px` | `2.25rem` |
| `38px` | `2.375rem` |
| `40px` | `2.5rem` |
| `42px` | `2.625rem` |
| `44px` | `2.75rem` |
| `48px` | `3rem` |
| `49px` | `3.0625rem` |
| `52px` | `3.25rem` |
| `56px` | `3.5rem` |
| `60px` | `3.75rem` |
| `64px` | `4rem` |
| `65px` | `4.0625rem` |
| `68px` | `4.25rem` |
| `72px` | `4.5rem` |
| `76px` | `4.75rem` |
| `80px` | `5rem` |
| `84px` | `5.25rem` |
| `88px` | `5.5rem` |
| `90px` | `5.625rem` |
| `91px` | `5.6875rem` |
| `92px` | `5.75rem` |
| `96px` | `6rem` |
| `100px` | `6.25rem` |
| `104px` | `6.5rem` |
| `105px` | `6.5625rem` |
| `108px` | `6.75rem` |
| `110px` | `6.875rem` |
| `112px` | `7rem` |
| `116px` | `7.25rem` |
| `120px` | `7.5rem` |
| `122px` | `7.625rem` |
| `124px` | `7.75rem` |
| `128px` | `8rem` |
| `130px` | `8.125rem` |
| `132px` | `8.25rem` |
| `136px` | `8.5rem` |
| `140px` | `8.75rem` |
| `141px` | `8.8125rem` |
| `144px` | `9rem` |
| `148px` | `9.25rem` |
| `150px` | `9.375rem` |
| `152px` | `9.5rem` |
| `156px` | `9.75rem` |
| `160px` | `10rem` |
| `164px` | `10.25rem` |
| `168px` | `10.5rem` |
| `170px` | `10.625rem` |
| `172px` | `10.75rem` |
| `176px` | `11rem` |
| `179px` | `11.1875rem` |
| `180px` | `11.25rem` |
| `184px` | `11.5rem` |
| `188px` | `11.75rem` |
| `190px` | `11.875rem` |
| `192px` | `12rem` |
| `196px` | `12.25rem` |
| `200px` | `12.5rem` |
| `204px` | `12.75rem` |
| `208px` | `13rem` |
| `212px` | `13.25rem` |
| `216px` | `13.5rem` |
| `220px` | `13.75rem` |
| `222px` | `13.875rem` |
| `224px` | `14rem` |
| `228px` | `14.25rem` |
| `232px` | `14.5rem` |
| `236px` | `14.75rem` |
| `240px` | `15rem` |
| `244px` | `15.25rem` |
| `248px` | `15.5rem` |
| `252px` | `15.75rem` |
| `256px` | `16rem` |
| `260px` | `16.25rem` |
| `264px` | `16.5rem` |
| `268px` | `16.75rem` |
| `280px` | `17.5rem` |
| `300px` | `18.75rem` |
| `320px` | `20rem` |
| `340px` | `21.25rem` |
| `360px` | `22.5rem` |
| `370px` | `23.125rem` |
| `400px` | `25rem` |
| `420px` | `26.25rem` |
| `440px` | `27.5rem` |
| `465px` | `29.0625rem` |
| `480px` | `30rem` |
| `483px` | `30.1875rem` |
| `490px` | `30.625rem` |
| `520px` | `32.5rem` |
| `560px` | `35rem` |
| `600px` | `37.5rem` |
| `630px` | `39.375rem` |
| `640px` | `40rem` |
| `670px` | `41.875rem` |
| `680px` | `42.5rem` |
| `700px` | `43.75rem` |
| `800px` | `50rem` |
| `820px` | `51.25rem` |
| `900px` | `56.25rem` |
| `1000px` | `62.5rem` |
| `1100px` | `68.75rem` |
| `1200px` | `75rem` |
| `1352px` | `84.5rem` |
| `1440px` | `90rem` |
| `9999px` | `624.9375rem` |

<!-- /ads:dimension-reference -->