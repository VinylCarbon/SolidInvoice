define(
    ['jquery', 'core/view', 'lodash', 'routing'],
    function($, ItemView, _, Routing) {
        "use strict";

        return ItemView.extend({
            clientForm: null,
            ui: {
                'clientChange': '#client-select-change',
                'clientSelect': '#client-select'
            },
            events: {
                'click @ui.clientChange': 'clientChange',
                'change @ui.clientSelect': 'clientSelect'
            },
            initialize: function() {
                this.template = _.bind(function() {
                    return this.getOption('clientForm');
                }, this);
            },
            onRender: function() {
                if (!this.model.isEmpty()) {
                    this.ui.clientSelect.hide();
                }
                this.selectDefaultClientContact();
            },
            clientChange: function(event) {
                event.preventDefault();

                this._toggleContactInfo();
            },
            clientSelect: function(event) {
                let val = $(event.target).val();
                if (parseInt(val, 10) === parseInt(this.model.id, 10)) {
                    this._toggleContactInfo();
                    return;
                }

                if (_.isEmpty(val)) {
                    return;
                }

                this.showLoader();

                $.getJSON(
                    Routing.generate('_xhr_clients_info', {id: val, type: this.getOption('type')}),
                    _.bind(function(data) {
                        this.$('#client-select-container').html(data.content);
                        this._toggleContactInfo(true);

                        if (this.options.hideLoader) {
                            this.hideLoader();
                        }

                        if (data.currency) {
                            data.client = val;
                            this.trigger('currency:update', data);
                        }
                    }, this)
                );
            },
            _toggleContactInfo: function(show) {
                const clientSelect = this.$('#client-select');
                const clientSelectContainer = this.$('#client-select-container');
                clientSelect.toggle();

                if (clientSelect.is(':visible')) {
                    clientSelect.find('select').select2().select2('val', 0);
                }

                if (!_.isUndefined(show)) {
                    if (true === show) {
                        clientSelectContainer.show();
                    } else {
                        clientSelectContainer.hide();
                    }
                } else {
                    clientSelectContainer.toggle();
                }
            },
            selectDefaultClientContact: function () {
                const clientSelectContainer = this.$('#client-select-container');
                const clientSelectContainerCheckbox = clientSelectContainer.find('input[type="checkbox"]');
                if (clientSelectContainerCheckbox.length === 1){
                    clientSelectContainerCheckbox.prop("checked", true);
                }
            }
        });
    });