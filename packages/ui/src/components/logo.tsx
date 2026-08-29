import { type ComponentProps } from "solid-js"

export const Mark = (props: { class?: string }) => {
  return (
    <svg
      data-component="logo-mark"
      classList={{ [props.class ?? ""]: !!props.class }}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="7" y="0" width="6" height="1" fill="var(--icon-strong-base, #FFE600)" />
      <rect x="5" y="1" width="10" height="1" fill="var(--icon-strong-base, #FFE600)" />
      <rect x="4" y="2" width="12" height="1" fill="var(--icon-strong-base, #FFE600)" />
      <rect x="3" y="3" width="14" height="1" fill="var(--icon-strong-base, #FFE600)" />
      <rect x="2" y="4" width="16" height="1" fill="var(--icon-strong-base, #FFE600)" />
      <rect x="0" y="5" width="20" height="1" fill="var(--icon-strong-base, #FFE600)" />
      <rect x="5" y="6" width="10" height="1" fill="var(--icon-strong-base, #FFE600)" />
      <rect x="4" y="7" width="12" height="1" fill="var(--icon-strong-base, #FFE600)" />
      <rect x="3" y="8" width="2" height="2" fill="var(--icon-strong-base, #FFE600)" />
      <rect x="7" y="8" width="6" height="2" fill="var(--icon-strong-base, #FFE600)" />
      <rect x="15" y="8" width="2" height="2" fill="var(--icon-strong-base, #FFE600)" />
      <rect x="3" y="10" width="14" height="1" fill="var(--icon-strong-base, #FFE600)" />
      <rect x="5" y="11" width="10" height="1" fill="var(--icon-strong-base, #FFE600)" />
      <rect x="6" y="12" width="8" height="1" fill="var(--icon-strong-base, #FFE600)" />
      <rect x="3" y="13" width="3" height="1" fill="var(--icon-strong-base, #FFE600)" />
      <rect x="8" y="13" width="4" height="1" fill="var(--icon-strong-base, #FFE600)" />
      <rect x="14" y="13" width="3" height="1" fill="var(--icon-strong-base, #FFE600)" />
      <rect x="2" y="14" width="5" height="1" fill="var(--icon-strong-base, #FFE600)" />
      <rect x="13" y="14" width="5" height="1" fill="var(--icon-strong-base, #FFE600)" />
      <rect x="1" y="15" width="7" height="1" fill="var(--icon-strong-base, #FFE600)" />
      <rect x="12" y="15" width="7" height="1" fill="var(--icon-strong-base, #FFE600)" />
      <rect x="0" y="16" width="9" height="1" fill="var(--icon-strong-base, #FFE600)" />
      <rect x="11" y="16" width="9" height="1" fill="var(--icon-strong-base, #FFE600)" />
    </svg>
  )
}

export const Splash = (props: Pick<ComponentProps<"svg">, "ref" | "class">) => {
  return (
    <svg
      ref={props.ref}
      data-component="logo-splash"
      classList={{ [props.class ?? ""]: !!props.class }}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0" y="0" width="40" height="40" rx="8" fill="#000000" stroke="#FFE600" stroke-width="2" />
      <g transform="translate(10, 10)">
        <Mark class="w-5 h-5" />
      </g>
    </svg>
  )
}

export const Logo = (props: { class?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 240 60"
      fill="none"
      classList={{ [props.class ?? ""]: !!props.class }}
    >
      <rect x="2" y="2" width="236" height="56" rx="8" fill="#000000" stroke="var(--icon-strong-base, #FFE600)" stroke-width="3" />
      <g transform="translate(12, 10)">
        <Mark class="w-10 h-10" />
      </g>
      <text x="64" y="38" fill="var(--icon-strong-base, #FFE600)" font-family="monospace" font-weight="bold" font-size="20" letter-spacing="2">
        AGENTX CODE
      </text>
    </svg>
  )
}
