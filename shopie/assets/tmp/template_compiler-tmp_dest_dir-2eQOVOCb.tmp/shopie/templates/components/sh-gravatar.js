export default Ember.HTMLBars.template((function() {
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
      "moduleName": "shopie/templates/components/sh-gravatar.hbs"
    },
    arity: 0,
    cachedFragment: null,
    hasRendered: false,
    buildFragment: function buildFragment(dom) {
      var el0 = dom.createDocumentFragment();
      var el1 = dom.createElement("img");
      dom.appendChild(el0, el1);
      var el1 = dom.createTextNode("\n");
      dom.appendChild(el0, el1);
      var el1 = dom.createElement("div");
      dom.setAttribute(el1,"class","email-input");
      var el2 = dom.createTextNode("\n  ");
      dom.appendChild(el1, el2);
      var el2 = dom.createComment("");
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
      var morphs = new Array(2);
      morphs[0] = dom.createAttrMorph(element0, 'src');
      morphs[1] = dom.createMorphAt(dom.childAt(fragment, [2]),1,1);
      return morphs;
    },
    statements: [
      ["attribute","src",["get","gravatarUrl",["loc",[null,[1,11],[1,22]]]]],
      ["inline","sh-input",[],["type","email","value",["subexpr","@mut",[["get","email",["loc",[null,[3,32],[3,37]]]]],[],[]],"placeholder","Enter your Gravatar e-mail"],["loc",[null,[3,2],[3,80]]]]
    ],
    locals: [],
    templates: []
  };
}()));