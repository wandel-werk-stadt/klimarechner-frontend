const population = 83_200_000

// 120qm in ha
const solarPotentialAreaPerPerson = 120 / 10_000
const windPotentialAreaPerPerson = solarPotentialAreaPerPerson / 3

export default {
    'buildings/base_data/inhabitants[k]': {
        private: population / 1000,
        industry: 44746,
        schools: 10735,
        public: 1556,
    },
    'buildings/base_data/n_buildings[]': {
        private: 19273286,
        industry: 1986122,
        schools: 56498,
        public: 128207,
    },
    'buildings/base_data/floor_area_per_building[qm]': {
        // private: 198,
        // industry: 737,
        // schools: 1843,
        // public: 337,
        private: (3_810_000 / 19_273_286) * 1000,
        industry: ((0.915 * 1_600_000) / (0.914 * 2_173_000)) * 1000,
        schools: ((9.7 * 10_735) / (0.026 * 2_173_000)) * 1000,
        public: ((0.027 * 1_600_000) / (0.059 * 2_173_000)) * 1000,
    },
    'buildings/demand/heat[k*W*h/qm/a]': {
        private: 114.44,
        industry: 96,
        schools: 96,
        public: 96,
    },
    'buildings/demand/hot_water_per_capita[k*W*h/a]': {
        private: 1_237.98,
        industry: 0,
        schools: 10,
        public: 0,
    },
    'buildings/demand/energy_per_capita[k*W*h/a]': {
        private: 1253,
        industry: 2058,
        schools: 50,
        public: 2058,
    },
    'buildings/heat_types_areas/oil_no_condensing[k*qm]': {
        private: 448022,
        industry: 126713,
        schools: 9013,
        public: 3739,
    },
    // mit brennwert
    'buildings/heat_types_areas/oil_with_condensing[k*qm]': {
        private: 496858,
        industry: 140525,
        schools: 9995,
        public: 4147,
    },
    'buildings/heat_types_areas/gas[k*qm]': {
        private: 1885950,
        industry: 766857,
        schools: 54546,
        public: 22629,
    },
    'buildings/heat_types_areas/heat_pump[k*qm]': {
        private: 106680,
        industry: 0,
        schools: 0,
        public: 0,
    },
    'buildings/heat_types_areas/district_heating[k*qm]': {
        private: 537210,
        industry: 313714,
        schools: 22314,
        public: 9257,
    },
    'buildings/district_heating_renewable_part[]': 0.08,
    'buildings/district_heating_price[EUR/k*W*h]': 0.065,
    'buildings/other_output_nrg_price[EUR/k*W*h]': 0.9956,
    'mobility/cars/n_pkw[k]': {
        private: 42180.847,
        industry: 4893.942,
        public: 258.098,
    },
    'mobility/cars/n_bev[k]': {
        private: 1013.009,
        industry: 102.972,
        public: 5.42,
    },
    'mobility/cars/kilometers_traveled_per_person[k*k*m]': 1246000000 / 83200000,
    'mobility/cars/mean_persons_per_car[]': 917 / 755,

    'mobility/street_lighting/street_lighting/n_lanterns[k]': 9250,
    'mobility/street_lighting/street_lighting/power_consumption_per_latern[k*W*h/a]': 432.4324,
    'mobility/street_lighting/street_lighting/other_costs_per_lantern[EUR/a]': 119.5403,

    'mobility/modal_split/shares/pedestrians[]': 0.029,
    'mobility/modal_split/shares/bicycle[]': 0.032,
    'mobility/modal_split/shares/public_transport[]': 0.145,
    'mobility/modal_split/shares/plane[]': 0.058,
    'mobility/modal_split/shares/car[]': 0.736,

    'energy/solar_roof/roof_area[ha]': {
        private: 2_442_000 / 10,
        industry: 3_402_900 / 10,
        public: 179_100 / 10,
    },
    'energy/solar_roof/solar_suitable_portion_of_roof_area[]': {
        private: 0.2,
        industry: 0.2,
        public: 0.2,
    },
    'energy/solar_roof/installed_power[M*Wp]': {
        private: 13903,
        industry: 19374,
        public: 1020,
    },
    'energy/solar_roof/self_consumption[]': {
        private: 0.25,
        industry: 0.25,
        public: 0.25,
    },
    'energy/solar_landscape/potential_area[ha]': {
        private: 0,
        industry: solarPotentialAreaPerPerson * population,
        public: solarPotentialAreaPerPerson * population,
    },
    'energy/solar_landscape/solar_area[ha]': {
        private: 0,
        industry: 30000,
        public: 0,
    },
    'energy/solar_landscape/self_consumption[]': {
        private: 0.3,
        industry: 0.4,
        public: 0.1,
    },
    'energy/wind/potential_area[ha]': {
        private: 0,
        industry: windPotentialAreaPerPerson * population,
        public: windPotentialAreaPerPerson * population,
    },
    'energy/wind/installed_area[ha]': {
        private: 0,
        industry: 241140,
        public: 0,
    },
    'energy/direct_aquisition_renewable_energies/power[G*W*h]': {
        private: 37200,
        industry: 34485,
        public: 1815,
    },
    'energy/direct_aquisition_renewable_energies/price[EUR/k*W*h]': {
        private: 0.3263,
        industry: 0.2323,
        public: 0.2323,
    },
    'energy/aquisition_power_mix/aquisition_power_mix[EUR/k*W*h]': {
        private: 0.3263,
        industry: 0.2323,
        public: 0.2323,
    },

    'buildings/fossil_fuel_prices/oil[EUR/L]': 0.9956,
    'buildings/fossil_fuel_prices/gas[EUR/m3]': 1.13,
    // durchschnittlicher Benzin- und Dieselpreis * Anteil Benzin und Diesel
    'mobility/fossil_fuel_prices/fuel[EUR/L]': 1.67,
}
