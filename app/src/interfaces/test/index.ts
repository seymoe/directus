import { DeepPartial, Field } from '@directus/shared/types';
import { defineInterface } from '@directus/shared/utils';
import InterfaceInput from './input.vue';
import PreviewSVG from './preview.svg?raw';

export default defineInterface({
	id: 'datagrid',
	name: 'Data Grid',
	description: '固定表格，创建字段指定列信息',
	icon: 'text_fields',
	component: InterfaceInput,
	types: ['json', 'text'],
	group: 'standard',
	options: ({ field }) => {
    const advancedList: DeepPartial<Field>[] = [
      {
        field: 'tableHeight',
        name: 'Table Height',
        type: 'integer',
        meta: {
          width: 'half',
          interface: 'input',
          options: {
            placeholder: 'Please enter table height',
          }
        }
      },
      {
        field: 'fixedTable',
        name: 'Fixed Table',
        type: 'boolean',
        meta: {
          width: 'half',
          interface: 'boolean'
        },
        schema: {
          default_value: false
        }
      },
      {
        field: 'renderChart',
        name: 'Show Chart',
        type: 'boolean',
        meta: {
          width: 'half',
          interface: 'boolean'
        },
        schema: {
          default_value: false
        }
      },
      {
        field: 'chartOptions',
        name: 'Chart Options',
        type: 'json',
        meta: {
          width: 'full',
          interface: 'input-code'
        },
        schema: {
          default_value: JSON.stringify({
            chart: {
              height: 350
            },
            series: [
              {
                name: 'A SERIES NAME',
                dataKey: 'power',
                type: 'line'
              }
            ],
            xaxis: {
              categoryKey: 'time'
            },
            yaxis: {
              min: 0
            }      
          }, null, 4)
        }
      }
    ]
		const jsonOptions: { standard: DeepPartial<Field>[]; advanced: DeepPartial<Field>[]; } = {
			standard: [
				{
          field: 'columns',
          name: 'Columns',
          type: 'json',
          meta: {
            width: 'full',
            interface: 'input-code'
          },
          schema: {
            default_value: JSON.stringify([
              {
                prop: 'time',
                name: 'Time'
              },
              {
                prop: 'power',
                name: 'Power',
                columnType: 'numeric'
              },
              {
                prop: 'name',
                name: 'Name'
              }
            ], null, 4)
          }
        }
			],
      advanced: advancedList
		};
    const textOptions: { standard:  DeepPartial<Field>[]; advanced: DeepPartial<Field>[]; } = {
      standard: [],
      advanced: advancedList
    }
    if (field?.type === 'json') {
			return jsonOptions;
		}
    if (field?.type === 'text') {
      return textOptions;
    }
	},
	preview: PreviewSVG,
});
