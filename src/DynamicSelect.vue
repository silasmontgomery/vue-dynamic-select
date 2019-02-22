<template>
    <div>
        <div class="vue-dynamic-select" @focusin="hasFocus=true" @focusout="hasFocus=false" @click="$refs.search.focus()">
            <div v-if="showPlaceholder" class="placeholder" v-text="placeholder" />
            <div class="saved-option" v-text="savedOption[optionText]" v-if="savedOption && !typing" />
            <input autocomplete="off" class="search" ref="search" v-model="search" @focus="typing=true" @blur="typing=false" @keyup="moveToResults" @keydown="removeOption" />
            <i class="dropdown" />
            <div v-if="showResultList" ref="resultList" class="result-list">
                <div ref="result" class="result" tabindex="0" @focus="typing=true" @blur="typing=false" v-for="result in results" :key="result[optionValue]" v-html="highlight(result[optionText])" @click.stop="selectOption(result)" @keyup="navigateResults(result, $event)" />
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            placeholder: {
                type: String, 
                default: 'search',
                required: false
            },
            options: {
                type: Array, 
                default: function() {
                    return []
                },
                required: true
            },
            optionValue: {
                type: String, 
                default: 'id',
                required: true
            },
            optionText: {
                type: String, 
                default: 'name',
                required: true
            },
            value: {
                type: Object,
                default: function() {
                    return null
                },
                required: false
            }
        },
        data: function() {
            return {
                hasFocus: false,
                typing: false,
                search: null,
                savedOption: null,
                selectedResult: 0
            };
        },
        mounted() {
            // Load selected option from prop
            if(this.value) {
                this.options.forEach(option => {
                    if(option[this.optionValue] == this.value[this.optionValue]) {
                        this.savedOption = option;
                    }
                })
            }
        },
        computed: {
            results: function() {
                // Filter items on search text (if not empty, case insensitive) and when item isn't already selected (else return all items not selected)
                return this.search ? this.options.filter(i => i[this.optionText].toLowerCase().indexOf(this.search.toLowerCase()) > -1) : this.options;
            },
            showResultList: function() {
                return this.hasFocus && this.results.length > 0;
            },
            showPlaceholder: function() {
                return !this.hasFocus && !this.savedOption;
            }
        },
        watch: {
            hasFocus: function() {
                // Clear the search box when component loses focus
                if(!this.hasFocus) {
                    this.typing = false;
                    this.search = null;
                }
            },
            savedOption: function() {
                // Provide selected items array to parent
                this.$emit('input', this.savedOption);
            },
            search: function() {
                // Provide search text to parent (for ajax fetching, etc)
                this.$emit('search', this.search);
            }
        },
        methods: {
            selectOption: function(option) {
                this.savedOption = option;
                this.search = null;
                this.$refs.search.blur();
                this.hasFocus = false;
            },
            removeOption: function(event) {
                // Remove selected option if user hits backspace on empty search field
                if(event.keyCode === 8 && (this.search == null || this.search == '')) {
                    this.savedOption = null;
                    this.$refs.search.blur();
                }
            },
            moveToResults: function(event) {
                // Move down to first result if user presses down arrow (from search field)
                if(event.keyCode === 40) {
                    if(this.$refs.result.length > 0) {
                        this.$refs.resultList.children.item(0).focus();
                    }
                }
            },
            navigateResults: function(option, event) {
                // Add option to selected items on enter key
                if(event.keyCode === 13) {
                    this.selectOption(option);
                // Move up or down items in result list with up or down arrow keys
                } else if(event.keyCode === 40 || event.keyCode === 38) {
                    if(event.keyCode === 40) {
                        this.selectedResult++;
                    } else if(event.keyCode === 38) {
                        this.selectedResult--;
                    }
                    let next = this.$refs.resultList.children.item(this.selectedResult);
                    if(next) {
                        next.focus();
                    } else {
                        this.selectedResult = 0;
                        this.$refs.search.focus();
                    }
                }
            },
            highlight: function(value) {
                // Highlights the part of each result that matches the search text
                if(this.search) {
                    let matchPos = value.toLowerCase().indexOf(this.search.toLowerCase());
                    if(matchPos > -1) {
                        let matchStr = value.substr(matchPos, this.search.length);
                        value = value.replace(matchStr, '<span style="font-weight: bold; background-color: #efefef;">'+matchStr+'</span>');
                    }
                }

                return value;
            }
        }
    }
</script>

<style scoped>
    .vue-dynamic-select {
        border: 1px solid #ced4da; 
        position: relative;
        padding: .375em .5em;
        border-radius: .25em;
        cursor: text;
        display: block;
    }
    .vue-dynamic-select i.dropdown {
        width: 0; 
        height: 0; 
        border-left: 4px solid transparent; 
        border-right: 4px solid transparent; 
        border-top: 4px solid; 
        float: right; 
        top: .75em; 
        opacity: .8; 
        cursor: pointer;
    }
    .vue-dynamic-select .placeholder {
        display: inline-block;
        color: #ccc;
    }
    .vue-dynamic-select .result-list {
        border: 1px solid #ced4da; 
        margin: calc(.375em - 1px) calc(-.5em - 1px);
        width: calc(100% + 2px);
        min-width: calc(100% + 2px);
        border-radius: 0 0 .25em .25em;
        cursor: pointer;
        position: absolute;
        z-index: 10;
        background-color: #fff;
    }
    .vue-dynamic-select .result-list .result {
        padding: .375em .75em;
        color: #333;
    }
    .vue-dynamic-select .result-list .result:hover, .vue-dynamic-select .result-list .result:focus {
        background-color: #efefef;
        outline: none;
    }
    .vue-dynamic-select .saved-option {
        display: inline-block;
    }
    .vue-dynamic-select .search {
        border: none;
        width: 50px;
    }
    .vue-dynamic-select .search:focus {
        outline: none;
    }
</style>
