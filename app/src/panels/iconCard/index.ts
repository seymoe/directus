import PanelComponent from './panel.vue';
import { definePanel } from '@directus/shared/utils';

export default definePanel({
	id: 'icon-card',
	name: 'Icon Card',
	description: 'Links made up of icons and text',
	icon: 'box',
	component: PanelComponent,
	options: [
		{
			field: 'linkList',
			name: 'Link List',
			type: 'json',
			meta: {
				interface: 'list',
				width: 'full',
        options: {
          fields: [
            {
              field: 'title',
              name: 'Title',
              type: 'string',
              meta: {
                field: 'title',
                interface: 'input',
                type: 'string',
                width: 'half'
              }
            },
            {
              field: 'subTitle',
              name: 'Sub Title',
              type: 'string',
              meta: {
                field: 'subTitle',
                interface: 'input',
                type: 'string',
                width: 'half'
              }
            },
            {
              field: 'icon',
              name: 'Icon',
              type: 'uuid',
              meta: {
                field: 'icon',
                interface: 'file-image',
                type: 'uuid',
                width: 'half'
              }
            },
            {
              field: 'url',
              name: 'Url',
              type: 'string',
              meta: {
                field: 'url',
                interface: 'input',
                type: 'string',
                width: 'half'
              }
            },
            {
              field: 'isBlank',
              name: 'Blank Open',
              type: 'boolean',
              meta: {
                field: 'isBlank',
                interface: 'boolean',
                type: 'boolean',
                width: 'half'
              },
              schema: {
                default_value: false
              }
            },
          ]
        }
			},
		},
    {
      field: 'imageToken',
      name: 'Static Access Token',
      type: 'string',
      meta: {
        note: 'Static access token is appended to the assets\' URL',
        width: 'half',
        interface: 'input',
      },
    },
	],
	minWidth: 12,
	minHeight: 8,
});
