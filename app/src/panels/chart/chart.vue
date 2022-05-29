<template>
	<div ref="chartEl" class="panel-chart" />
</template>

<script>
import { defineComponent, ref, watch, onMounted, onUnmounted, computed } from 'vue'
import ApexCharts from 'apexcharts'
import { useI18n } from 'vue-i18n'

import { useApi, useStores } from '@directus/extensions-sdk'

function cssVar(name) {
	return getComputedStyle(document.body).getPropertyValue(name).trim()
}
function getEndpoint(collection) {
	if (collection.startsWith('directus_')) {
		return `/${collection.substring(9)}`
	}
	return `/items/${collection}`
}

export default defineComponent({
	props: {
		height: {
			type: Number,
			required: true,
		},
		showHeader: {
			type: Boolean,
			default: false,
		},
		id: {
			type: String,
			required: true,
		},
		collection: {
			type: String,
			required: true,
		},
		valueField: {
			type: String,
			required: true,
		},
		categoryField: {
			type: String,
			required: true,
		},
		function: {
			type: String,
			required: true,
		},
    color: {
			type: String,
			default: cssVar('--primary'),
		},
		filter: {
			type: Object,
			default: () => ({}),
		},
    chartType: {
			type: String,
			default: 'line',
		},
    fillType: {
			type: String,
			default: 'gradient',
		},
    curveType: {
			type: String,
			default: 'smooth',
		}
	},
	setup(props) {
    const api = useApi()
    const { useFieldsStore } = useStores()
		const { t, n } = useI18n()

		const fieldsStore = useFieldsStore()

		const metrics = ref([])
		const loading = ref(false)
		const error = ref()
		const chartEl = ref()
		const chart = ref()

		const valueLabel = computed(() => {
			const field = fieldsStore.getField(props.collection, props.valueField)
			const operation = t(props.function)
			return `${field.name} (${operation})`
		})

		watch(
			[
        () => props.chartType,
				() => props.collection,
				() => props.valueField,
				() => props.categoryField,
				() => props.function,
				() => props.color,
				() => props.filter,
				() => props.fillType,
				() => props.curveType,
			],
			() => {
				fetchData()
				chart.value?.destroy()
				setupChart()
			},
			{ deep: true }
		)

		fetchData()

		onMounted(setupChart)
		onUnmounted(() => {
			chart.value?.destroy()
		})

		return { chartEl, metrics, loading, error }

		async function fetchData() {
			loading.value = true;
			try {
				const results = await api.get(getEndpoint(props.collection), {
					params: {
						groupBy: [props.categoryField],
						aggregate: {
							[props.function]: [props.valueField],
						},
						filter: {
							_and: [
								props.filter || {},
							],
						},
						limit: -1,
					},
				})

        let list = results.data.data;
				metrics.value = list.filter(item => !!item[props.categoryField])

        let opt = genOptions()

        opt.chart.type = props.chartType
        if (['line', 'area'].includes(props.chartType)) {
          opt.xaxis = {
            type: 'category',
            categories: metrics.value.map(item => item[props.categoryField]),
          }
          opt.series = [
            {
              name: props.collection,
              data: metrics.value.map((metric) => Number(Number(metric[props.function][props.valueField]).toFixed(0))),
            }
          ]
        } else if (['pie', 'donut'].includes(props.chartType)) {
          opt.series = metrics.value.map((metric) => Number(Number(metric[props.function][props.valueField]).toFixed(0)))
          opt.labels = metrics.value.map(item => item[props.categoryField])
        } else if (['column'].includes(props.chartType)) {
          opt.chart.type = 'bar'
          opt.series = [
            {
              name: props.collection,
              data: metrics.value.map((metric) => Number(Number(metric[props.function][props.valueField]).toFixed(0))),
            }
          ]
          opt.xaxis = {
            type: 'category',
            categories: metrics.value.map(item => item[props.categoryField]),
          }
        } else if (['bar'].includes(props.chartType)) {
          opt.series = [{
            data: metrics.value.map((metric) => Number(Number(metric[props.function][props.valueField]).toFixed(0))),
          }]
          opt.xaxis = {
            type: 'category',
            categories: metrics.value.map(item => item[props.categoryField]),
          }
        }
        console.log(props.chartType, opt)
        chart.value?.updateOptions(opt)
			} catch (err) {
				error.value = err
			} finally {
				loading.value = false
			}
		}

		function genOptions() {
      if (['line', 'column', 'area'].includes(props.chartType)) {
        return {
          colors: [props.color ? props.color : cssVar('--primary')],
          chart: {
            height: '100%',
            zoom: {
              enabled: false,
            }
          },
          series: [],
          stroke: {
            curve: props.curveType,
            width: 1,
            lineCap: 'round',
          },
          fill: props.chartType === 'area' ? {
            type: props.fillType,
            gradient: {
              colorStops: [
                [
                  {
                    offset: 0,
                    color: props.color ? props.color : cssVar('--primary'),
                    opacity: 0.25,
                  },
                  {
                    offset: 100,
                    color: props.color ? props.color : cssVar('--primary'),
                    opacity: 0,
                  },
                ],
              ],
            },
          } : { type: 'solid' },
          xaxis: {
            type: 'category',
            categories: [],
          },
          tooltip: {
            y: {
              title: {
                formatter: () => valueLabel.value + ': ',
              },
              formatter(value) {
                return n(value)
              },
            }
          }
        }
      } else if (['pie', 'donut'].includes(props.chartType)) {
        return {
          chart: {
            type: props.chartType,
            width: '100%',
            height: '100%'
          },
          series: [],
          labels: [],
          responsive: [{
            breakpoint: 480,
            options: {
              chart: {
                width: 200
              },
              legend: {
                position: 'bottom'
              }
            }
          }]
        }
      } else if (['bar'].includes(props.chartType)) {
        return {
          colors: [props.color ? props.color : cssVar('--primary')],
          series: [{ data: [] }],
          chart: {
            type: 'bar',
            height: '100%'
          },
          plotOptions: {
            bar: {
              borderRadius: 2,
              horizontal: true,
            }
          },
          dataLabels: {
            enabled: false
          },
          xaxis: {
            categories: []
          },
          tooltip: {
            y: {
              title: {
                formatter: () => valueLabel.value + ': ',
              },
              formatter(value) {
                return n(value)
              },
            }
          }
        }
      }
    }

		function setupChart() {
      const opt = genOptions()
			chart.value = new ApexCharts(chartEl.value, opt)
			chart.value.render()
		}
	},
});
</script>

<style scoped>
.panel-chart {
	width: 100%;
	height: 100%;
}
</style>

<style>
.panel-chart .apexcharts-tooltip.apexcharts-theme-dark {
  color: #444;
}
.apexcharts-tooltip.apexcharts-theme-light {
	border-color: var(--border-normal) !important;
}

.apexcharts-tooltip.apexcharts-theme-light .apexcharts-tooltip-title {
	border-color: var(--border-normal) !important;
	margin-bottom: 0;
	padding: 0 4px;
	font-weight: 600 !important;
	font-size: 10px !important;
	background-color: var(--background-subdued) !important;
}

.apexcharts-tooltip-y-group {
	padding: 0 0 0 4px;
	font-weight: 600 !important;
	font-size: 10px !important;
}

.apexcharts-tooltip-series-group {
	background-color: var(--background-normal) !important;
	padding: 0;
}

.apexcharts-tooltip-series-group:last-child {
	padding-bottom: 0;
}
</style>
