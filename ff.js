const context = {};
const resources = [];

function render(link, element) {
    const timeout = setTimeout(function() {
        throw {
            error: 'Timeout',
            message: `Does ${link} call its done() function?`
        }
    }, document.ffTimeout || 2000);

    const parent = element.parentNode;
    resources.push(link);
    const done = () => {
        clearTimeout(timeout);
        resources.splice(resources.indexOf(link), 1);
        console.log(resources)
        if (resources.length === 0) {
            if (typeof(bootstrap) === 'function') {
                bootstrap(context);
            }
        }
    }

    return fetch(link).then(res => res.text()).then(x => {
        const container = document.createElement('div');
        container.innerHTML = x;

        const contentNode = container.childNodes[0];

        parent.replaceChild(contentNode, element);

        const init = new Function('done', 'context', 'element', container.childNodes[1].innerHTML);
        init(done, context, contentNode);
    });
}
