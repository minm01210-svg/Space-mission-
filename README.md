# Launch, Travel, and Orbit Datasets

These files cover the non-landing part of the mission:

1. Launch vehicle sizing and propulsion.
2. Spacecraft performance inputs.
3. Earth, Moon, and Mars gravity/orbit constants.
4. Preliminary transfer and orbit reference cases.
5. Spacecraft state and mission-design input templates.
6. Launch-site, stage, burn-plan, atmosphere, ephemeris, and validation inputs.

Landing, entry, parachute, heat-shield, terrain, and powered-descent data are intentionally excluded because those belong to the EDL/landing team.

## Files

| File | Use |
|---|---|
| `celestial_bodies.csv` | Gravity, radius, rotation, and orbital constants |
| `launch_vehicle_specs.csv` | Launcher mass, thrust, dimensions, and payload references |
| `propulsion_specs.csv` | Chemical engines and electric thrusters |
| `spacecraft_input_template.csv` | Values your team must fill for the spacecraft |
| `orbit_targets.csv` | Starting and destination orbit definitions |
| `transfer_reference.csv` | Preliminary LEO-to-Moon and LEO-to-Mars transfer references |
| `source_register.csv` | NASA, JPL, and Kaggle source register |
| `dataset_manifest.json` | Machine-readable file descriptions and provenance |
| `planetary_ephemeris_template.csv` | Epoch-specific state-vector template for Horizons/SPICE |
| `launch_site_specs.csv` | Preliminary launch-site coordinates and azimuth ranges |
| `rocket_stage_specs.csv` | Stage-level mass, thrust, Isp, and burn inputs |
| `spacecraft_propulsion.csv` | Spacecraft chemical and electric propulsion inputs |
| `mission_burn_plan.csv` | Planned departure, correction, and orbit-insertion burns |
| `atmospheric_properties.csv` | Preliminary Earth/Mars ascent-drag atmosphere values |
| `validation_cases.csv` | Analytical and historical sanity-check cases |

## Source policy

- NASA, JPL, ULA, and ESA pages are used for physical constants and launcher/engine specifications when an official value is available.
- Kaggle launch datasets are useful for historical launch dates, mission outcomes, payload metadata, and cross-checking. They should not override an official NASA/JPL/launcher specification without verification.
- The included transfer values are derived calculations, not copied observations.
- Kaggle datasets can have different licenses and update dates. Check the dataset card before redistribution or commercial use.

## Important model boundary

These are preliminary-design datasets. The transfer values use two-body or patched-conic reference calculations. They do not replace a numerical trajectory propagator, launch-window search, or high-fidelity ephemeris.

For a higher-fidelity pass, validate with [JPL Horizons](https://ssd.jpl.nasa.gov/horizons/), [NASA SPICE/NAIF](https://naif.jpl.nasa.gov/naif/index), or [NASA GMAT](https://software.nasa.gov/software/GSC-19640-1).

## Website integration

Place the `datasets` folder beside the website files. The first website can use these CSV files as the source for its spacecraft presets, destination values, and mission checks. Do not silently replace blank values with zero.

## Units

- Distance: km unless the column ends in `_m`.
- Mass: kg.
- Thrust: N.
- Specific impulse: seconds.
- Angles: degrees.
- Time: seconds or days as stated in the column name.
- Gravitational parameter: km³/s² unless the column says otherwise.

## Processing and cleanliness

The CSV files use one header row, stable snake_case column names, explicit units in column names where practical, and plain text suitable for software ingestion. Blank cells mean required input not supplied and must not be treated as zero. Each row includes a quality or provenance label where a value is approximate, derived, official-reference, or team input. These files are cleaned for preliminary analysis, not certified for flight design.
