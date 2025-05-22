# Segment

Experimental client modding toolkit for Matrix's Element

### Heavily hardcoded proof of concept. Not meant for any usage at all yet.

## Main Problem

Segment will inject and patch the asar, along with settings the electron fuses to disable asar verif, although opening
element (On macOS at least) will just crash Electron/Element no matter what.