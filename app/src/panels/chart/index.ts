import { definePanel } from '@directus/shared/utils';
import PanelChart from './chart.vue';

export default definePanel({
	id: 'panel-chart',
	name: 'Charts',
	description: 'Charts',
	icon: 'show_chart',
	component: PanelChart,
	options: [
		{
      field: 'collection',
      type: 'string',
      name: '$t:collection',
      meta: {
        interface: 'system-collection',
        options: {
          includeSystem: true,
        },
        selectedCollection: '',
        hasBeenSelected: false,
        width: 'half',
      },
    },
    {
      field: 'chartType',
      name: 'Chart Type',
      type: 'string',
      meta: {
        interface: 'select-dropdown',
        options: {
          choices: [
            { text: 'Line', value: 'line' },
            { text: 'Area', value: 'area' },
            { text: 'Column', value: 'column' },
            { text: 'Bar', value: 'bar' },
            { text: 'Pie', value: 'pie' },
            { text: 'Donut', value: 'donut' }
          ]
        },
        width: 'half',
        default: 'line'
      },
    },
    {
			field: 'categoryField',
			type: 'string',
			name: 'Category Field',
			meta: {
				interface: 'system-field',
				options: {
					collectionField: 'collection',
					// typeAllowList: ['date', 'dateTime', 'timestamp'],
				},
				width: 'half',
			},
		},
		{
			field: 'function',
			type: 'string',
			name: '$t:group_aggregation',
			meta: {
				width: 'half',
				interface: 'select-dropdown',
				options: {
					choices: [
						{
							text: 'Count',
							value: 'count',
						},
						{
							text: 'Count (Distinct)',
							value: 'countDistinct',
						},
						{
							text: 'Average',
							value: 'avg',
						},
						{
							text: 'Average (Distinct)',
							value: 'avgDistinct',
						},
						{
							text: 'Sum',
							value: 'sum',
						},
						{
							text: 'Sum (Distinct)',
							value: 'sumDistinct',
						},
						{
							text: 'Minimum',
							value: 'min',
						},
						{
							text: 'Maximum',
							value: 'max',
						},
					],
				},
			},
		},
    {
			field: 'valueField',
			type: 'string',
			name: 'Value Field',
			meta: {
				interface: 'system-field',
				options: {
					collectionField: 'collection',
					typeAllowList: ['string', 'integer', 'bigInteger', 'float', 'decimal'],
				},
				width: 'half',
			},
		},
    {
			field: 'color',
			name: '$t:color',
			type: 'string',
			meta: {
				interface: 'select-color',
				width: 'half',
			},
		},
    {
			field: 'filter',
			type: 'json',
			name: '$t:filter',
			meta: {
				interface: 'system-filter',
				options: {
					collectionField: 'collection',
				},
			},
		}
	],
	minWidth: 12,
	minHeight: 6,
});
