import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  'container-fluid': {
    'marginTop': [{ 'unit': 'em', 'value': 1.2 }]
  },
  'card': {
    'marginTop': [{ 'unit': 'em', 'value': 1 }],
    'marginBottom': [{ 'unit': 'em', 'value': 1 }]
  },
  'i': {
    'marginRight': [{ 'unit': 'px', 'value': 10 }]
  },
  'alertText': {
    'minHeight': [{ 'unit': 'em', 'value': 4 }]
  },
  'btn-space': {
    'marginLeft': [{ 'unit': 'em', 'value': 1 }]
  },
  'modal-lg': {
    'maxWidth': [{ 'unit': '%H', 'value': 1 }, { 'unit': 'string', 'value': '!important' }]
  },
  'scrollable-menu': {
    'height': [{ 'unit': 'string', 'value': 'auto' }],
    'maxHeight': [{ 'unit': 'em', 'value': 50 }],
    'overflowX': 'hidden'
  },
  'tooltip': {
    'position': 'relative',
    'display': 'inline-block',
    'borderBottom': [{ 'unit': 'px', 'value': 1 }, { 'unit': 'string', 'value': 'dotted' }, { 'unit': 'string', 'value': 'black' }]
  },
  'tooltip tooltiptext': {
    'visibility': 'hidden',
    'width': [{ 'unit': 'px', 'value': 120 }],
    'backgroundColor': '#555',
    'color': '#fff',
    'textAlign': 'center',
    'padding': [{ 'unit': 'px', 'value': 5 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 5 }, { 'unit': 'px', 'value': 0 }],
    'borderRadius': '6px',
    'position': 'absolute',
    'zIndex': '1',
    'bottom': [{ 'unit': '%V', 'value': 1.25 }],
    'left': [{ 'unit': '%H', 'value': 0.5 }],
    'marginLeft': [{ 'unit': 'px', 'value': -60 }],
    'opacity': '0',
    'transition': 'opacity 0.3s'
  },
  'tooltip tooltiptext::after': {
    'content': '""',
    'position': 'absolute',
    'top': [{ 'unit': '%V', 'value': 1 }],
    'left': [{ 'unit': '%H', 'value': 0.5 }],
    'marginLeft': [{ 'unit': 'px', 'value': -5 }],
    'borderWidth': '5px',
    'borderStyle': 'solid',
    'borderColor': '#555 transparent transparent transparent'
  },
  'tooltip:hover tooltiptext': {
    'visibility': 'visible',
    'opacity': '1'
  }
});
