'strict mode';

const state = [
  {
    type: 'error',
    message: 'message',
    title: 'title',
    callback(e) {
      console.log(e);
    },
  },
  {
    type: 'error',
    message: 'message message',
    title: 'title',
    callback() {
      console.log(e);
    },
  },
];

const createEl = {
  dom: null,
  oldId: 0,
  createIcon() {
    const iconEl = document.createElement('div');
    iconEl.className = 'icon';
    return iconEl;
  },

  createContent({ title, message }) {
    const content = document.createElement('div');
    const titleEl = document.createElement('div');
    titleEl.innerText = title;
    titleEl.className = 'title';
    const messageEl = document.createElement('div');
    messageEl.innerText = message;
    messageEl.className = 'message';
    content.insertAdjacentElement('beforeend', titleEl);
    content.insertAdjacentElement('beforeend', messageEl);
    return content;
  },

  createButton({ name, id }) {
    const button = document.createElement('button');
    button.className = 'button';
    button.innerText = name;
    button.dataset.id = id;
    button.dataset.type = 'close';
    return button;
  },

  createMessage({ type, title, message, id }) {
    const element = document.createElement('div');
    element.className = `element ${type}`;

    element.insertAdjacentElement('beforeend', this.createIcon({ icon: 'I' }));
    element.insertAdjacentElement(
      'beforeend',
      this.createContent({ title, message }),
    );
    element.insertAdjacentElement(
      'beforeend',
      this.createButton({ name: 'X', id }),
    );
    return element;
  },

  createContainer(state) {
    const container = document.createElement('div');
    container.className = `container`;
    container.innerHTML = state
      .map(item => createEl.createMessage(item).outerHTML)
      .join(' ');
    return container;
  },

  createProvider() {
    const provider = document.createElement('div');
    provider.className = `yesh_notifications__provider`;
    return provider;
  },
};

class YESH_Notification {
  constructor(ref) {
    this.ref = ref;
    this.provider = null;
    this.container = null;
    this.state = [];
  }

  handleClick = e => {
    const id = e?.target?.dataset?.id;
    const type = e?.target?.dataset?.type;
    if (id && type === 'callback') {
      const findEl = this.state.find(item => +item.id === +id);
      if (findEl?.callback) {
        findEl.callback(e);
      }
    }
    if (id && type === 'close') {
      this.state = this.state.filter(item => +item.id !== +id);
      this.update()
    }
  };

  addListener = () => {
    if (this.ref) {
      this.ref.addEventListener('click', this.handleClick);
    }
  };

  removeListener = () => {
    if (this.ref) {
      this.ref.removeEventListener('click', this.handleClick);
    }
  };

  create = state => {
    this.removeListener();
    this.provider = createEl.createProvider();
    this.container = createEl.createContainer(state);
    this.provider.appendChild(this.container);
    this.ref.innerHTML=this.provider.outerHTML
    this.addListener();
  };

  update = obj => {
    if(obj){
      this.state = [...this.state, obj];
    }
    this.create(this.state);
  };

  init = () => {
    this.create([]);
    return this;
  };
}

const Provider = elementId => {
  try {
    if (!elementId)
      throw new Error({ message: 'You forgot to pass the element ID' });
    const element = document.getElementById(elementId);
    if (!elementId) throw new Error({ message: 'Тo such id found in Dom' });
    createEl.dom = new YESH_Notification(element).init();
  } catch (error) {
    console.dir(error.message);
  }
};
function generateID() {
  createEl.oldId += 1;
  return createEl.oldId;
}

function message(mess) {
  console.log({ mess, dom: createEl.dom });
  mess.id = generateID();
  createEl.dom && createEl.dom.update(mess);
}

function click(mess) {
  console.log({ mess, dom: createEl.dom });
  createEl.dom && createEl.dom.update(mess);
}
