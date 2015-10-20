export default Ember.HTMLBars.template((function() {
  var child0 = (function() {
    return {
      meta: {
        "revision": "Ember@1.13.10",
        "loc": {
          "source": null,
          "start": {
            "line": 17,
            "column": 13
          },
          "end": {
            "line": 19,
            "column": 10
          }
        },
        "moduleName": "shopie/templates/product.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("\n            ");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("span");
        dom.setAttribute(el1,"class","octicon octicon-issue-opened");
        var el2 = dom.createTextNode(" issues");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n          ");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes() { return []; },
      statements: [

      ],
      locals: [],
      templates: []
    };
  }());
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
          "line": 38,
          "column": 0
        }
      },
      "moduleName": "shopie/templates/product.hbs"
    },
    arity: 0,
    cachedFragment: null,
    hasRendered: false,
    buildFragment: function buildFragment(dom) {
      var el0 = dom.createDocumentFragment();
      var el1 = dom.createElement("div");
      dom.setAttribute(el1,"class","product-wrap");
      var el2 = dom.createTextNode("\n  ");
      dom.appendChild(el1, el2);
      var el2 = dom.createElement("div");
      dom.setAttribute(el2,"class","product-intro");
      var el3 = dom.createTextNode("\n    ");
      dom.appendChild(el2, el3);
      var el3 = dom.createElement("div");
      dom.setAttribute(el3,"class","row");
      var el4 = dom.createTextNode("\n      ");
      dom.appendChild(el3, el4);
      var el4 = dom.createElement("div");
      dom.setAttribute(el4,"class","title center");
      var el5 = dom.createElement("h1");
      dom.setAttribute(el5,"class","entry title");
      var el6 = dom.createComment("");
      dom.appendChild(el5, el6);
      dom.appendChild(el4, el5);
      dom.appendChild(el3, el4);
      var el4 = dom.createTextNode("\n      ");
      dom.appendChild(el3, el4);
      var el4 = dom.createElement("div");
      dom.setAttribute(el4,"class","large-8 columns large-centered text-center");
      var el5 = dom.createTextNode("\n        ");
      dom.appendChild(el4, el5);
      var el5 = dom.createElement("div");
      dom.setAttribute(el5,"class","sub-intro");
      var el6 = dom.createComment("");
      dom.appendChild(el5, el6);
      dom.appendChild(el4, el5);
      var el5 = dom.createTextNode("\n      ");
      dom.appendChild(el4, el5);
      dom.appendChild(el3, el4);
      var el4 = dom.createTextNode("\n      ");
      dom.appendChild(el3, el4);
      var el4 = dom.createComment("");
      dom.appendChild(el3, el4);
      var el4 = dom.createTextNode("\n    ");
      dom.appendChild(el3, el4);
      dom.appendChild(el2, el3);
      var el3 = dom.createTextNode("\n  ");
      dom.appendChild(el2, el3);
      dom.appendChild(el1, el2);
      var el2 = dom.createTextNode("\n  ");
      dom.appendChild(el1, el2);
      var el2 = dom.createElement("div");
      dom.setAttribute(el2,"class","product-cta noise");
      var el3 = dom.createElement("div");
      dom.setAttribute(el3,"class","wrap");
      var el4 = dom.createTextNode("\n    ");
      dom.appendChild(el3, el4);
      var el4 = dom.createElement("div");
      dom.setAttribute(el4,"class","row");
      var el5 = dom.createTextNode("\n      ");
      dom.appendChild(el4, el5);
      var el5 = dom.createElement("div");
      dom.setAttribute(el5,"class","large-6 small-12 columns center-column");
      var el6 = dom.createTextNode("\n      ");
      dom.appendChild(el5, el6);
      var el6 = dom.createElement("ul");
      dom.setAttribute(el6,"class","action-lists");
      var el7 = dom.createTextNode("\n        ");
      dom.appendChild(el6, el7);
      var el7 = dom.createElement("li");
      dom.setAttribute(el7,"class","title");
      var el8 = dom.createElement("p");
      var el9 = dom.createTextNode("Support: ");
      dom.appendChild(el8, el9);
      dom.appendChild(el7, el8);
      dom.appendChild(el6, el7);
      var el7 = dom.createTextNode("\n        ");
      dom.appendChild(el6, el7);
      var el7 = dom.createElement("li");
      var el8 = dom.createTextNode("\n          ");
      dom.appendChild(el7, el8);
      var el8 = dom.createElement("p");
      var el9 = dom.createComment("");
      dom.appendChild(el8, el9);
      dom.appendChild(el7, el8);
      var el8 = dom.createTextNode("\n        ");
      dom.appendChild(el7, el8);
      dom.appendChild(el6, el7);
      var el7 = dom.createTextNode("\n        ");
      dom.appendChild(el6, el7);
      var el7 = dom.createElement("li");
      var el8 = dom.createTextNode("\n          ");
      dom.appendChild(el7, el8);
      var el8 = dom.createElement("p");
      var el9 = dom.createElement("a");
      dom.setAttribute(el9,"href","/wiki/");
      var el10 = dom.createElement("span");
      dom.setAttribute(el10,"class","octicon octicon-book");
      var el11 = dom.createTextNode(" documentation");
      dom.appendChild(el10, el11);
      dom.appendChild(el9, el10);
      dom.appendChild(el8, el9);
      dom.appendChild(el7, el8);
      var el8 = dom.createTextNode("\n        ");
      dom.appendChild(el7, el8);
      dom.appendChild(el6, el7);
      var el7 = dom.createTextNode("\n      ");
      dom.appendChild(el6, el7);
      dom.appendChild(el5, el6);
      var el6 = dom.createTextNode("\n      ");
      dom.appendChild(el5, el6);
      dom.appendChild(el4, el5);
      var el5 = dom.createTextNode("\n    ");
      dom.appendChild(el4, el5);
      dom.appendChild(el3, el4);
      var el4 = dom.createTextNode("\n  ");
      dom.appendChild(el3, el4);
      dom.appendChild(el2, el3);
      dom.appendChild(el1, el2);
      var el2 = dom.createTextNode("\n  ");
      dom.appendChild(el1, el2);
      var el2 = dom.createElement("div");
      dom.setAttribute(el2,"id","product-about-text");
      dom.setAttribute(el2,"class","product-about");
      var el3 = dom.createTextNode("\n    ");
      dom.appendChild(el2, el3);
      var el3 = dom.createElement("div");
      dom.setAttribute(el3,"class","row");
      var el4 = dom.createTextNode("\n      ");
      dom.appendChild(el3, el4);
      var el4 = dom.createElement("div");
      dom.setAttribute(el4,"class","large-9 small-12 columns center-column");
      var el5 = dom.createTextNode("\n        ");
      dom.appendChild(el4, el5);
      var el5 = dom.createElement("div");
      dom.setAttribute(el5,"class","entry_content");
      var el6 = dom.createTextNode("\n          ");
      dom.appendChild(el5, el6);
      var el6 = dom.createComment("");
      dom.appendChild(el5, el6);
      var el6 = dom.createTextNode("\n        ");
      dom.appendChild(el5, el6);
      dom.appendChild(el4, el5);
      var el5 = dom.createTextNode("\n      ");
      dom.appendChild(el4, el5);
      dom.appendChild(el3, el4);
      var el4 = dom.createTextNode("\n    ");
      dom.appendChild(el3, el4);
      dom.appendChild(el2, el3);
      var el3 = dom.createTextNode("\n  ");
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
      var element1 = dom.childAt(element0, [1, 1]);
      var morphs = new Array(5);
      morphs[0] = dom.createMorphAt(dom.childAt(element1, [1, 0]),0,0);
      morphs[1] = dom.createMorphAt(dom.childAt(element1, [3, 1]),0,0);
      morphs[2] = dom.createMorphAt(element1,5,5);
      morphs[3] = dom.createMorphAt(dom.childAt(element0, [3, 0, 1, 1, 1, 3, 1]),0,0);
      morphs[4] = dom.createMorphAt(dom.childAt(element0, [5, 1, 1, 1]),1,1);
      return morphs;
    },
    statements: [
      ["content","model.name",["loc",[null,[4,56],[4,70]]]],
      ["inline","sh-format-markdown",[["get","model.shortDescription",["loc",[null,[6,52],[6,74]]]]],[],["loc",[null,[6,31],[6,76]]]],
      ["inline","sh-btn-group-type",[],["dataGroupType","atau","primaryAction","purchase","primaryActionText","Beli sekarang","secondaryAction","read","secondaryActionText","Pelajari dulu"],["loc",[null,[8,6],[8,166]]]],
      ["block","link-to",["issues",["get","model.formatSlug",["loc",[null,[17,33],[17,49]]]]],[],0,null,["loc",[null,[17,13],[19,22]]]],
      ["inline","sh-format-markdown",[["get","model.description",["loc",[null,[32,31],[32,48]]]]],[],["loc",[null,[32,10],[32,50]]]]
    ],
    locals: [],
    templates: [child0]
  };
}()));