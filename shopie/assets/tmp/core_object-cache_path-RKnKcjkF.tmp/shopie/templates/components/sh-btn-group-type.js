define('shopie/templates/components/sh-btn-group-type', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.10",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 5,
            "column": 0
          }
        },
        "moduleName": "shopie/templates/components/sh-btn-group-type.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","button-group");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("a");
        dom.setAttribute(el2,"class","button primary radius");
        dom.setAttribute(el2,"href","#");
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("a");
        dom.setAttribute(el2,"class","button secondary radius");
        dom.setAttribute(el2,"href","#");
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        var element1 = dom.childAt(element0, [1]);
        var element2 = dom.childAt(element0, [3]);
        var morphs = new Array(5);
        morphs[0] = dom.createAttrMorph(element0, 'data-grouptype');
        morphs[1] = dom.createElementMorph(element1);
        morphs[2] = dom.createMorphAt(element1,0,0);
        morphs[3] = dom.createElementMorph(element2);
        morphs[4] = dom.createMorphAt(element2,0,0);
        return morphs;
      },
      statements: [
        ["attribute","data-grouptype",["concat",[["get","dataGroupType",["loc",[null,[1,44],[1,57]]]]]]],
        ["element","action",["primaryAction"],[],["loc",[null,[2,5],[2,31]]]],
        ["content","primaryActionText",["loc",[null,[2,71],[2,92]]]],
        ["element","action",["secondaryAction"],[],["loc",[null,[3,5],[3,33]]]],
        ["content","secondaryActionText",["loc",[null,[3,75],[3,98]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});