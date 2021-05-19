! function e(t, a, r) {
    function o(d, s) {
        if (!a[d]) {
            if (!t[d]) {
                var i = "function" == typeof require && require;
                if (!s && i) return i(d, !0);
                if (l) return l(d, !0);
                var n = new Error("Cannot find module '" + d + "'");
                throw n.code = "MODULE_NOT_FOUND", n
            }
            var c = a[d] = {
                exports: {}
            };
            t[d][0].call(c.exports, (function (e) {
                return o(t[d][1][e] || e)
            }), c, c.exports, e, t, a, r)
        }
        return a[d].exports
    }
    for (var l = "function" == typeof require && require, d = 0; d < r.length; d++) o(r[d]);
    return o
}({
    1: [function (e, t, a) {
        const r = e("./card"),
            o = e("./list"),
            l = e("./tag");
        var d = {
            base_url: document.location.protocol + "//" + document.location.hostname + ":3010",
            init: function () {
                o.setBaseUrl(d.base_url), r.setBaseUrl(d.base_url), l.setBaseUrl(d.base_url), d.addListenerToActions(), d.getListsFromAPI()
            },
            addListenerToActions: () => {
                document.getElementById("addListButton").addEventListener("click", o.showAddModal);
                let e = document.querySelectorAll(".close");
                for (let t of e) t.addEventListener("click", d.hideModals);
                document.querySelector("#addListModal form").addEventListener("submit", d.handleAddListForm), document.querySelector("#addCardModal form").addEventListener("submit", d.handleAddCardForm), document.getElementById("editTagsButton").addEventListener("click", l.showEditModal), document.getElementById("newTagForm").addEventListener("submit", l.handleNewTag)
            },
            hideModals: () => {
                let e = document.querySelectorAll(".modal");
                for (let t of e) t.classList.remove("is-active")
            },
            handleAddListForm: async e => {
                e.preventDefault(), await o.handleAddFormSubmit(e), d.hideModals()
            },
            handleAddCardForm: async e => {
                e.preventDefault(), await r.handleAddFormSubmit(e), d.hideModals()
            },
            getListsFromAPI: async () => {
                try {
                    let e = await fetch(d.base_url + "/lists");
                    if (200 !== e.status) {
                        throw await e.json()
                    } {
                        let t = await e.json();
                        for (let e of t) {
                            let t = o.makeListDOMObject(e.name, e.id);
                            o.addListToDOM(t);
                            for (let t of e.cards) {
                                let a = r.makeCardDOMObject(t.content, t.id, t.color);
                                r.addCardToDOM(a, e.id);
                                for (let e of t.tags) {
                                    let a = l.makeTagDOMObject(e.name, e.color, e.id, t.id);
                                    l.addTagToDOM(a, t.id)
                                }
                            }
                        }
                    }
                    let t = document.querySelector(".card-lists");
                    new Sortable(t, {
                        group: "project",
                        draggable: ".panel",
                        onEnd: o.handleDropList
                    })
                } catch (e) {
                    alert("Impossible de charger les listes depuis l'API."), console.error(e)
                }
            }
        };
        document.addEventListener("DOMContentLoaded", d.init)
    }, {
        "./card": 2,
        "./list": 3,
        "./tag": 4
    }],
    2: [function (e, t, a) {
        const r = e("./tag"),
            o = {
                base_url: null,
                setBaseUrl: e => {
                    o.base_url = e + "/cards"
                },
                showAddModal: e => {
                    let t = e.target.closest(".panel");
                    console.log("listElement => ", t);
                    const a = t.getAttribute("list-id");
                    let r = document.getElementById("addCardModal");
                    r.querySelector('input[name="list_id"]').value = a, r.classList.add("is-active")
                },
                handleAddFormSubmit: async e => {
                    let t = new FormData(e.target);
                    for (const e of t.entries()) console.log("les clés - valeurs de mon formdata => ", e[0] + ", " + e[1]);
                    try {
                        let e = await fetch(o.base_url, {
                            method: "POST",
                            body: t
                        });
                        if (200 != e.status) {
                            throw await e.json()
                        } {
                            let t = await e.json(),
                                a = o.makeCardDOMObject(t.content, t.id, t.color);
                            o.addCardToDOM(a, t.list_id)
                        }
                    } catch (e) {
                        alert("Impossible de créer une carte"), console.error(e)
                    }
                },
                showEditForm: e => {
                    let t = e.target.closest(".box"),
                        a = t.querySelector("form"),
                        r = t.querySelector(".card-name");
                    a.querySelector('input[name="content"]').value = r.textContent, a.querySelector('input[name="color"]').value = o.rgb2hex(t.style.backgroundColor), r.classList.add("is-hidden"), a.classList.remove("is-hidden")
                },
                handleEditCardForm: async e => {
                    e.preventDefault();
                    let t = new FormData(e.target),
                        a = e.target.closest(".box");
                    const r = a.getAttribute("card-id");
                    try {
                        let e = await fetch(o.base_url + "/" + r, {
                            method: "PATCH",
                            body: t
                        });
                        if (200 !== e.status) {
                            throw await e.json()
                        } {
                            let t = await e.json();
                            a.querySelector(".card-name").textContent = t.content, a.style.backgroundColor = t.color
                        }
                    } catch (e) {
                        alert("Impossible de modifier la carte"), console.error(e)
                    }
                    e.target.classList.add("is-hidden"), a.querySelector(".card-name").classList.remove("is-hidden")
                },
                makeCardDOMObject: (e, t, a) => {
                    let l = document.getElementById("template-card"),
                        d = document.importNode(l.content, !0);
                    d.querySelector(".card-name").textContent = e;
                    let s = d.querySelector(".box");
                    return s.setAttribute("card-id", t), s.setAttribute("style", "background-color: " + a), d.querySelector(".button--edit-card").addEventListener("click", o.showEditForm), d.querySelector("form").addEventListener("submit", o.handleEditCardForm), d.querySelector(".button--delete-card").addEventListener("click", o.deleteCard), d.querySelector(".button--add-tag").addEventListener("click", r.showAssociateModal), d
                },
                addCardToDOM: (e, t) => {
                    document.querySelector(`[list-id="${t}"]`).querySelector(".panel-block").appendChild(e)
                },
                deleteCard: async e => {
                    if (!confirm("Supprimer cette carte ?")) return;
                    let t = e.target.closest(".box");
                    const a = t.getAttribute("card-id");
                    try {
                        let e = await fetch(o.base_url + "/" + a, {
                            method: "DELETE"
                        });
                        if (!e.ok) {
                            throw await e.json()
                        }
                        t.remove()
                    } catch (e) {
                        alert("Impossible de supprimer la carte"), console.error(e)
                    }
                },
                rgb2hex: e => {
                    if ("#" === e.charAt(0)) return e;
                    let t = e.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);

                    function a(e) {
                        return ("0" + parseInt(e).toString(16)).slice(-2)
                    }
                    return "#" + a(t[1]) + a(t[2]) + a(t[3])
                }
            };
        t.exports = o
    }, {
        "./tag": 4
    }],
    3: [function (e, t, a) {
        const r = e("./card"),
            o = {
                base_url: null,
                setBaseUrl: e => {
                    o.base_url = e + "/lists"
                },
                showAddModal: () => {
                    document.getElementById("addListModal").classList.add("is-active")
                },
                handleAddFormSubmit: async e => {
                    let t = new FormData(e.target),
                        a = document.querySelectorAll(".panel").length;
                    t.set("page_order", a);
                    try {
                        let e = await fetch(o.base_url, {
                            method: "POST",
                            body: t
                        });
                        if (200 !== e.status) {
                            throw await e.json()
                        } {
                            const t = await e.json();
                            let a = o.makeListDOMObject(t.name, t.id);
                            o.addListToDOM(a)
                        }
                    } catch (e) {
                        alert("Impossible de créer une liste"), console.error(e)
                    }
                },
                showEditForm: e => {
                    let t = e.target.closest(".panel").querySelector("form");
                    t.querySelector('input[name="name"]').value = e.target.textContent, e.target.classList.add("is-hidden"), t.classList.remove("is-hidden")
                },
                handleEditListForm: async e => {
                    e.preventDefault();
                    let t = new FormData(e.target),
                        a = e.target.closest(".panel");
                    const r = a.getAttribute("list-id");
                    try {
                        let e = await fetch(o.base_url + "/" + r, {
                            method: "PATCH",
                            body: t
                        });
                        if (200 !== e.status) {
                            throw await e.json()
                        } {
                            let t = await e.json();
                            a.querySelector("h2").textContent = t.name
                        }
                    } catch (e) {
                        alert("Impossible de modifier la liste"), console.error(e)
                    }
                    e.target.classList.add("is-hidden"), a.querySelector("h2").classList.remove("is-hidden")
                },
                makeListDOMObject: (e, t) => {
                    let a = document.getElementById("template-list"),
                        l = document.importNode(a.content, !0);
                    l.querySelector("h2").textContent = e, l.querySelector(".panel").setAttribute("list-id", t), l.querySelector(".button--add-card").addEventListener("click", r.showAddModal),
                        //!
                        l.querySelector("h2").addEventListener("dblclick", o.showEditForm), l.querySelector("form").addEventListener("submit", o.handleEditListForm), l.querySelector(".button--delete-list").addEventListener("click", o.deleteList);
                    let d = l.querySelector(".panel-block");
                    return new Sortable(d, {
                        group: "list",
                        draggable: ".box",
                        onEnd: o.handleDropCard
                    }), l
                },
                addListToDOM: e => {
                    document.querySelector(".card-lists").append(e), document.querySelector(".card-lists").scrollTo(document.querySelector(".card-lists").offsetWidth, 0)
                },
                deleteList: async e => {
                    let t = e.target.closest(".panel");
                    const a = t.getAttribute("list-id");
                    if (t.querySelectorAll(".box").length) alert("Impossible de supprimer une liste non vide");
                    else if (confirm("Supprimer cette liste ?")) try {
                        let e = await fetch(o.base_url + "/" + a, {
                            method: "DELETE"
                        });
                        if (!e.ok) {
                            throw await e.json()
                        }
                        t.remove()
                    } catch (e) {
                        alert("Impossible de supprimer la liste."), console.log(e)
                    }
                },
                updateAllLists: () => {
                    document.querySelectorAll(".panel").forEach(((e, t) => {
                        const a = e.getAttribute("list-id");
                        let r = new FormData;
                        r.set("position", t), fetch(o.base_url + "/" + a, {
                            method: "PATCH",
                            body: r
                        })
                    }))
                },
                updateAllCards: (e, t) => {
                    e.forEach(((e, a) => {
                        const o = e.getAttribute("card-id");
                        let l = new FormData;
                        l.set("position", a), l.set("list_id", t), fetch(r.base_url + "/" + o, {
                            method: "PATCH",
                            body: l
                        })
                    }))
                },
                handleDropCard: e => {
                    e.item;
                    let t = e.from,
                        a = e.to,
                        r = t.querySelectorAll(".box"),
                        l = t.closest(".panel").getAttribute("list-id");
                    o.updateAllCards(r, l), t !== a && (r = a.querySelectorAll(".box"), l = a.closest(".panel").getAttribute("list-id"), o.updateAllCards(r, l))
                },
                handleDropList: e => {
                    o.updateAllLists()
                }
            };
        t.exports = o
    }, {
        "./card": 2
    }],
    4: [function (e, t, a) {
        const r = {
            base_url: null,
            setBaseUrl: e => {
                r.base_url = e
            },
            makeTagDOMObject: (e, t, a, o) => {
                let l = document.createElement("div");
                return l.classList.add("tag"), l.setAttribute("style", "font-weight: bold; color:white"), l.style.backgroundColor = t, l.textContent = e, l.setAttribute("tag-id", a), l.setAttribute("card-id", o), l.addEventListener("dblclick", r.disassociateTag), l
            },
            addTagToDOM: (e, t) => {
                document.querySelector(`[card-id="${t}"] .tags`).appendChild(e)
            },
            showAssociateModal: async e => {
                const t = e.target.closest(".box").getAttribute("card-id"),
                    a = document.getElementById("associateTagModal");
                try {
                    let e = await fetch(r.base_url + "/tags");
                    if (!e.ok) {
                        throw await e.json()
                    } {
                        let o = await e.json(),
                            l = document.createElement("section");
                        l.classList.add("modal-card-body");
                        for (let e of o) {
                            let a = r.makeTagDOMObject(e.name, e.color, e.id, t);
                            a.addEventListener("click", r.handleAssociateTag), l.appendChild(a)
                        }
                        a.querySelector(".modal-card-body").replaceWith(l), a.classList.add("is-active")
                    }
                } catch (e) {
                    alert("Impossible de récupérer les tags"), console.error(e)
                }
            },
            handleAssociateTag: async e => {
                const t = e.target.getAttribute("tag-id"),
                    a = e.target.getAttribute("card-id");
                console.log("cardId => ", a);
                try {
                    let e = new FormData;
                    e.set("tagid", t);
                    for (const t of e.entries()) console.log("les clés - valeurs de mon formdata => ", t[0] + ", " + t[1]);
                    let o = await fetch(r.base_url + `/cards/${a}/tags`, {
                        method: "POST",
                        body: e
                    });
                    if (!o.ok) {
                        throw await o.json()
                    } {
                        let e = await o.json(),
                            t = document.querySelectorAll(`[card-id="${e.id}"] .tag`);
                        for (let e of t) e.remove();
                        let a = document.querySelector(`[card-id="${e.id}"] .tags`);
                        for (let t of e.tags) {
                            let o = r.makeTagDOMObject(t.name, t.color, t.id, e.id);
                            a.appendChild(o)
                        }
                    }
                } catch (e) {
                    alert("Impossible d'associer le tag"), console.error(e)
                }
                document.getElementById("associateTagModal").classList.remove("is-active")
            },
            disassociateTag: async e => {
                const t = e.target.getAttribute("tag-id"),
                    a = e.target.getAttribute("card-id");
                try {
                    let o = await fetch(r.base_url + `/cards/${a}/tags/${t}`, {
                        method: "DELETE"
                    });
                    if (!o.ok) {
                        throw await o.json()
                    }
                    e.target.remove()
                } catch (e) {
                    alert("Impossible de désassocier le tag"), console.error(e)
                }
            },
            makeEditTagForm: e => {
                let t = document.getElementById("newTagForm"),
                    a = document.importNode(t, !0);
                a.setAttribute("id", null), a.classList.add("editTagForm"), a.querySelector('[name="name"]').value = e.name, a.querySelector('[name="color"]').value = e.color, console.log(e.color, a.querySelector('[name="color"]').value), a.setAttribute("tag-id", e.id), a.addEventListener("submit", r.handleEditTag);
                let o = document.createElement("div");
                return o.classList.add("button", "is-small", "is-danger"), o.textContent = "Supprimer", o.addEventListener("click", r.handleDeleteTag), a.querySelector(".field").appendChild(o), a
            },
            showEditModal: async () => {
                try {
                    let e = await fetch(r.base_url + "/tags");
                    const t = document.getElementById("addAndEditTagModal");
                    let a = await e.json(),
                        o = document.createElement("div");
                    o.classList.add("editTagForms");
                    for (let e of a) {
                        let t = r.makeEditTagForm(e);
                        o.appendChild(t)
                    }
                    t.querySelector(".editTagForms").replaceWith(o), t.classList.add("is-active")
                } catch (e) {
                    alert("Impossible de récupérer les tags"), console.error(e)
                }
            },
            handleNewTag: async e => {
                e.preventDefault();
                let t = new FormData(e.target);
                try {
                    let e = await fetch(r.base_url + "/tags", {
                        method: "POST",
                        body: t
                    });
                    if (!e.ok) {
                        throw await e.json()
                    }
                } catch (e) {
                    alert("Impossible de créer le tag"), console.error(e)
                }
                document.getElementById("addAndEditTagModal").classList.remove("is-active")
            },
            handleEditTag: async e => {
                e.preventDefault();
                let t = new FormData(e.target),
                    a = e.target.getAttribute("tag-id");
                try {
                    let e = await fetch(r.base_url + "/tags/" + a, {
                        method: "PATCH",
                        body: t
                    });
                    if (!e.ok) {
                        throw await e.json()
                    } {
                        let t = await e.json(),
                            a = document.querySelectorAll(`[tag-id="${t.id}"]`);
                        for (let e of a) e.textContent = t.name, e.style.backgroundColor = t.color
                    }
                } catch (e) {
                    alert("Impossible de mettre le tag à jour"), console.error(e)
                }
                document.getElementById("addAndEditTagModal").classList.remove("is-active")
            },
            handleDeleteTag: async e => {
                const t = e.target.closest("form").getAttribute("tag-id");
                try {
                    let e = await fetch(r.base_url + "/tags/" + t, {
                        method: "DELETE"
                    });
                    if (!e.ok) {
                        throw await e.json()
                    } {
                        let e = document.querySelectorAll(`[tag-id="${t}"]`);
                        for (let t of e) t.remove()
                    }
                } catch (e) {
                    alert("Impossible de supprimer le tag"), console.error(e)
                }
                document.getElementById("addAndEditTagModal").classList.remove("is-active")
            }
        };
        t.exports = r
    }, {}]
}, {}, [1]);