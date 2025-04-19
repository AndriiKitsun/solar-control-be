# solar-control-be

## 1.7.0

### Minor Changes

- [#67](https://github.com/AndriiKitsun/solar-control-be/pull/67) [`877d6b4`](https://github.com/AndriiKitsun/solar-control-be/commit/877d6b4d423505ab786465cc1c8627f2ce645a5e) Thanks [@AndriiKitsun](https://github.com/AndriiKitsun)! - SC-158: Add additional logging for scaling checks

- [#68](https://github.com/AndriiKitsun/solar-control-be/pull/68) [`7551722`](https://github.com/AndriiKitsun/solar-control-be/commit/75517228ee01cd85b616ddfc52464b0eef711ef6) Thanks [@AndriiKitsun](https://github.com/AndriiKitsun)! - SC-154: Add Asic setting to prevent control automation during T2 zone

- [#69](https://github.com/AndriiKitsun/solar-control-be/pull/69) [`113d776`](https://github.com/AndriiKitsun/solar-control-be/commit/113d77679cbce62cc417abc169abd9262fec2a30) Thanks [@AndriiKitsun](https://github.com/AndriiKitsun)! - SC-159: Adjust AC Output Frequency protection rule

### Patch Changes

- [#66](https://github.com/AndriiKitsun/solar-control-be/pull/66) [`b823902`](https://github.com/AndriiKitsun/solar-control-be/commit/b823902a53d266ba41a6064204283c10f093a31b) Thanks [@AndriiKitsun](https://github.com/AndriiKitsun)! - SC-157: Asic preset comparison should include the current Asic status

## 1.6.1

### Patch Changes

- [#64](https://github.com/AndriiKitsun/solar-control-be/pull/64) [`d058d3e`](https://github.com/AndriiKitsun/solar-control-be/commit/d058d3ecd57fb129fe75abce7a70cc2640bba7d1) Thanks [@AndriiKitsun](https://github.com/AndriiKitsun)! - SC-147: Global Asic voltage should be integer during switching preset

## 1.6.0

### Minor Changes

- [#56](https://github.com/AndriiKitsun/solar-control-be/pull/56) [`19d435b`](https://github.com/AndriiKitsun/solar-control-be/commit/19d435b3dc6c3ae9de607689a38be805f0f26b5c) Thanks [@AndriiKitsun](https://github.com/AndriiKitsun)! - SC-111: Protection rules collection consistency

- [#53](https://github.com/AndriiKitsun/solar-control-be/pull/53) [`dcac211`](https://github.com/AndriiKitsun/solar-control-be/commit/dcac2113575274ce2302e05da6a178f0350f726a) Thanks [@AndriiKitsun](https://github.com/AndriiKitsun)! - SC-113: Implement Control rules collection

  - Add `automation/control` collection
  - Add Asics control automation strategies (scale up & scale out strategies)

- [#57](https://github.com/AndriiKitsun/solar-control-be/pull/57) [`21483ce`](https://github.com/AndriiKitsun/solar-control-be/commit/21483ce92ddeed64b20fcc4250783609c76d1a38) Thanks [@AndriiKitsun](https://github.com/AndriiKitsun)! - SC-139: Delete deprecated logic related to avg voltage calculation

- [#60](https://github.com/AndriiKitsun/solar-control-be/pull/60) [`140ccb7`](https://github.com/AndriiKitsun/solar-control-be/commit/140ccb7e9f49b04c8917232b10b5818871c7e0fe) Thanks [@AndriiKitsun](https://github.com/AndriiKitsun)! - SC-119: Asic scaling UAT testing

  - Use async EventEmitter listeners
  - Handle and log unknown errors during Asic scaling
  - Update Asic scaling log messages
  - Prevent Asic from stopping when the status is not "mining" (also prevents stopping already stopped Asic)
  - Prevent Asic increment scaling when it is still starting
  - Prevent switching to the first Asic preset when the current preset is already the first
  - Change the debug log level to info for the runWith method

- [#54](https://github.com/AndriiKitsun/solar-control-be/pull/54) [`f146a4b`](https://github.com/AndriiKitsun/solar-control-be/commit/f146a4bab050e2a24af76301e8ae8ebce311b3f3) Thanks [@AndriiKitsun](https://github.com/AndriiKitsun)! - SC-140: Add automation control flag to Asic model

- [#61](https://github.com/AndriiKitsun/solar-control-be/pull/61) [`e989e1f`](https://github.com/AndriiKitsun/solar-control-be/commit/e989e1f30a7a09f23f879babdfccbda1315e5b56) Thanks [@AndriiKitsun](https://github.com/AndriiKitsun)! - SC-145: Cover Asics module with unit tests

- [#55](https://github.com/AndriiKitsun/solar-control-be/pull/55) [`c887311`](https://github.com/AndriiKitsun/solar-control-be/commit/c887311abd1d6fbe2b60d7ceeda924d47e6f3e16) Thanks [@AndriiKitsun](https://github.com/AndriiKitsun)! - SC-142: Refactor Asics API Service

- [#62](https://github.com/AndriiKitsun/solar-control-be/pull/62) [`a99ca39`](https://github.com/AndriiKitsun/solar-control-be/commit/a99ca397e71283b0867331c374f2b92b00ab3482) Thanks [@AndriiKitsun](https://github.com/AndriiKitsun)! - SC-144: Cover Logs module with unit tests

- [#58](https://github.com/AndriiKitsun/solar-control-be/pull/58) [`fe53d5d`](https://github.com/AndriiKitsun/solar-control-be/commit/fe53d5d4269f8ef2fa9df006db4a7a3b3d112dcd) Thanks [@AndriiKitsun](https://github.com/AndriiKitsun)! - SC-143: Add Asic scaling logging

### Patch Changes

- [#59](https://github.com/AndriiKitsun/solar-control-be/pull/59) [`0964072`](https://github.com/AndriiKitsun/solar-control-be/commit/096407286837d298068e5158b035fea52c368827) Thanks [@AndriiKitsun](https://github.com/AndriiKitsun)! - SC-146: Cache keys should be unique

## 1.5.0

### Minor Changes

- [#51](https://github.com/AndriiKitsun/solar-control-be/pull/51) [`2eb68af`](https://github.com/AndriiKitsun/solar-control-be/commit/2eb68af5444707b537bb3443ed00c8cc2c646c41) Thanks [@AndriiKitsun](https://github.com/AndriiKitsun)! - SC-136: Turn off Asics after T2 zone end

## 1.4.0

### Minor Changes

- [#49](https://github.com/AndriiKitsun/solar-control-be/pull/49) [`645b3a6`](https://github.com/AndriiKitsun/solar-control-be/commit/645b3a64d8d814e5e03c055196b92866b10d4f01) Thanks [@AndriiKitsun](https://github.com/AndriiKitsun)! - SC-131: Migrate to ESP protection system

- [#47](https://github.com/AndriiKitsun/solar-control-be/pull/47) [`abc7c07`](https://github.com/AndriiKitsun/solar-control-be/commit/abc7c077a548dbc761d6a58a3c8008c204a2daf2) Thanks [@AndriiKitsun](https://github.com/AndriiKitsun)! - SC-116: Add cron job to start Asics during T2 zone

- [#47](https://github.com/AndriiKitsun/solar-control-be/pull/47) [`abc7c07`](https://github.com/AndriiKitsun/solar-control-be/commit/abc7c077a548dbc761d6a58a3c8008c204a2daf2) Thanks [@AndriiKitsun](https://github.com/AndriiKitsun)! - SC-121: Refresh auth token before Asics power off

- [#46](https://github.com/AndriiKitsun/solar-control-be/pull/46) [`6a4debb`](https://github.com/AndriiKitsun/solar-control-be/commit/6a4debbabaad75c80867a98ebe4c8f610f11ab6a) Thanks [@AndriiKitsun](https://github.com/AndriiKitsun)! - SC-126: Delete Barrel exports from feature modules

### Patch Changes

- [#48](https://github.com/AndriiKitsun/solar-control-be/pull/48) [`0ed6deb`](https://github.com/AndriiKitsun/solar-control-be/commit/0ed6deb9359d16d809955cf1889abbb0201978ba) Thanks [@AndriiKitsun](https://github.com/AndriiKitsun)! - SC-123: Turn of ESP power relay when protection has been triggered

- [#48](https://github.com/AndriiKitsun/solar-control-be/pull/48) [`0ed6deb`](https://github.com/AndriiKitsun/solar-control-be/commit/0ed6deb9359d16d809955cf1889abbb0201978ba) Thanks [@AndriiKitsun](https://github.com/AndriiKitsun)! - SC-127: Protection rule is not disabled on ESP

## 1.3.1

### Patch Changes

- [#44](https://github.com/AndriiKitsun/solar-control-be/pull/44) [`9021fc4`](https://github.com/AndriiKitsun/solar-control-be/commit/9021fc459cf6d53d46d00537934bf62e9ef04afe) Thanks [@AndriiKitsun](https://github.com/AndriiKitsun)! - SC-120: Asics cache is not flushed during adding new one

## 1.3.0

### Minor Changes

- [#35](https://github.com/AndriiKitsun/solar-control-be/pull/35) [`c15a67e`](https://github.com/AndriiKitsun/solar-control-be/commit/c15a67e0bb9cb76fdd232d6867468121271a165a) Thanks [@AndriiKitsun](https://github.com/AndriiKitsun)! - SC-102: Calculate avg voltage for DC Battery based on 50 values

- [#37](https://github.com/AndriiKitsun/solar-control-be/pull/37) [`7cf4155`](https://github.com/AndriiKitsun/solar-control-be/commit/7cf415578adf63572e3c9e0d2fcbd3d3c588dc2c) Thanks [@AndriiKitsun](https://github.com/AndriiKitsun)! - SC-103: Implement logger for error and fatal severity

- [#42](https://github.com/AndriiKitsun/solar-control-be/pull/42) [`4be055a`](https://github.com/AndriiKitsun/solar-control-be/commit/4be055a1b09b193f2708c887f8016a28017e3dd9) Thanks [@AndriiKitsun](https://github.com/AndriiKitsun)! - SC-114: Return logs in specified order

- [#40](https://github.com/AndriiKitsun/solar-control-be/pull/40) [`cdac87d`](https://github.com/AndriiKitsun/solar-control-be/commit/cdac87d022ce53da731bdebfd74dcb0aae1caf87) Thanks [@AndriiKitsun](https://github.com/AndriiKitsun)! - SC-106: Implement Protection rule collection

- [#41](https://github.com/AndriiKitsun/solar-control-be/pull/41) [`8f44252`](https://github.com/AndriiKitsun/solar-control-be/commit/8f442528aabd2aa2d746b18928d0ca3a6bac08aa) Thanks [@AndriiKitsun](https://github.com/AndriiKitsun)! - SC-107: Implement protection rules events

- [#39](https://github.com/AndriiKitsun/solar-control-be/pull/39) [`17168f7`](https://github.com/AndriiKitsun/solar-control-be/commit/17168f7b2165d07298a03f34b2346e2456a5af32) Thanks [@AndriiKitsun](https://github.com/AndriiKitsun)! - SC-109: ECONABORTED from postgres

- [#38](https://github.com/AndriiKitsun/solar-control-be/pull/38) [`2e9b0a8`](https://github.com/AndriiKitsun/solar-control-be/commit/2e9b0a8a57eb586db87444c1c1a41437e9c21b49) Thanks [@AndriiKitsun](https://github.com/AndriiKitsun)! - SC-92: Independent HTTP config per 3d-party API

### Patch Changes

- [#36](https://github.com/AndriiKitsun/solar-control-be/pull/36) [`ff2ef22`](https://github.com/AndriiKitsun/solar-control-be/commit/ff2ef22d436e02c67c804d00015b78c6f64678b6) Thanks [@AndriiKitsun](https://github.com/AndriiKitsun)! - SC-00: Async pzem table clearing

## 1.2.0

### Minor Changes

- [#31](https://github.com/AndriiKitsun/solar-control-be/pull/31) [`dba0e7a`](https://github.com/AndriiKitsun/solar-control-be/commit/dba0e7a37cbac4e7be8d6c6559cdecc1fee62422) Thanks [@AndriiKitsun](https://github.com/AndriiKitsun)! - SC-96: Add endpoints to control ESP relay

- [#33](https://github.com/AndriiKitsun/solar-control-be/pull/33) [`f2d05c7`](https://github.com/AndriiKitsun/solar-control-be/commit/f2d05c77b38f1578fef86daf7d666b3c44d82174) Thanks [@AndriiKitsun](https://github.com/AndriiKitsun)! - SC-94: Update ESP schema

## 1.1.0

### Minor Changes

- [#25](https://github.com/AndriiKitsun/solar-control-be/pull/25) [`16a2f82`](https://github.com/AndriiKitsun/solar-control-be/commit/16a2f8284e6840c963c8cf0c7e762742fb4a9bfb) Thanks [@AndriiKitsun](https://github.com/AndriiKitsun)! - SC-72: [Asics]: Return Asic summary stats

- [#24](https://github.com/AndriiKitsun/solar-control-be/pull/24) [`24dbd57`](https://github.com/AndriiKitsun/solar-control-be/commit/24dbd573c1a661bca99a537d1078658493efb2d7) Thanks [@AndriiKitsun](https://github.com/AndriiKitsun)! - SC-73: [Asics]: Extend POST /asics endpoint

- [#29](https://github.com/AndriiKitsun/solar-control-be/pull/29) [`2bddcfc`](https://github.com/AndriiKitsun/solar-control-be/commit/2bddcfcd8acbe522ba6ec03de61a43a912b29552) Thanks [@AndriiKitsun](https://github.com/AndriiKitsun)! - SC-88: [Pzems] 10m voltage calculation should include all 10minutes values

- [#27](https://github.com/AndriiKitsun/solar-control-be/pull/27) [`573130c`](https://github.com/AndriiKitsun/solar-control-be/commit/573130c70bf92410ac35e7fb4eceea27c0151bbd) Thanks [@AndriiKitsun](https://github.com/AndriiKitsun)! - SC-95: Return current preset and duration time

- [#24](https://github.com/AndriiKitsun/solar-control-be/pull/24) [`24dbd57`](https://github.com/AndriiKitsun/solar-control-be/commit/24dbd573c1a661bca99a537d1078658493efb2d7) Thanks [@AndriiKitsun](https://github.com/AndriiKitsun)! - SC-62: [Asics] Implement API error handling

- [#26](https://github.com/AndriiKitsun/solar-control-be/pull/26) [`f92ab53`](https://github.com/AndriiKitsun/solar-control-be/commit/f92ab533e584502b8a19c900b78f5572a4ecbcdf) Thanks [@AndriiKitsun](https://github.com/AndriiKitsun)! - SC-87: Create endpoint to save currency settings

- [#28](https://github.com/AndriiKitsun/solar-control-be/pull/28) [`44277a1`](https://github.com/AndriiKitsun/solar-control-be/commit/44277a17d86390c90b1dbf614d1ae15c75fd8239) Thanks [@AndriiKitsun](https://github.com/AndriiKitsun)! - SC-61: [Asics] Encrypt Asic password on update

## 1.0.1

### Patch Changes

- [#22](https://github.com/AndriiKitsun/solar-control-be/pull/22) [`23e0eb6`](https://github.com/AndriiKitsun/solar-control-be/commit/23e0eb6b09810b9bd64d6a1e794f65b819c38f79) Thanks [@AndriiKitsun](https://github.com/AndriiKitsun)! - SC-77: Update project based on the latest tag

## 1.0.0

### Major Changes

- [#20](https://github.com/AndriiKitsun/solar-control-be/pull/20) [`0f2b62f`](https://github.com/AndriiKitsun/solar-control-be/commit/0f2b62faa7964128f631ce8b9fae842a3c04c3fb) Thanks [@AndriiKitsun](https://github.com/AndriiKitsun)! - Init release
