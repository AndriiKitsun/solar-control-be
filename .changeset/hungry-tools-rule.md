---
'solar-control-be': minor
---

SC-119: Asic scaling UAT testing

- Use async EventEmitter listeners
- Handle and log unknown errors during Asic scaling
- Update Asic scaling log messages
- Prevent Asic from stopping when the status is not "mining" (also prevents stopping already stopped Asic)
- Prevent Asic increment scaling when it is still starting
- Prevent switching to the first Asic preset when the current preset is already the first
- Change the debug log level to info for the runWith method
