






this is router Contract {
  MaxUint256
    interface: Interface {
      fragments: [ [FunctionFragment], [FunctionFragment] ],
      _abiCoder: AbiCoder { coerceFunc: null },
      functions: {
        'getAmountsOut(uint256,address[])': [FunctionFragment],
        'swapExactTokensForTokens(uint256,uint256,address[],address,uint256)': [FunctionFragment]
      },
      errors: {},
      events: {},
      structs: {},
      deploy: ConstructorFragment {
        name: null,
        type: 'constructor',
        inputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        gas: null,
        _isFragment: true
      },
      _isInterface: true
    },
    provider: WebSocketProvider {
      _isProvider: true,
      _events: [],
      _emitted: { block: -2 },
      disableCcipRead: false,
      formatter: Formatter { formats: [Object] },
      anyNetwork: false,
      _networkPromise: Promise { <pending> },
      _maxInternalBlockNumber: -1024,
      _lastBlockNumber: -2,
      _maxFilterBlockRange: 10,
      _pollingInterval: -1,
      _fastQueryDate: 0,
      connection: {
        url: 'https://yolo-wider-hill.bsc.quiknode.pro/c680fc743463c7a53d2849eaa857a38793ee4fcf/'
      },
      _nextId: 42,
      _wsReady: false,
      _websocket: WebSocket {
        _events: [Object: null prototype],
        _eventsCount: 2,
        _maxListeners: undefined,
        _binaryType: 'nodebuffer',
        _closeCode: 1006,
        _closeFrameReceived: false,
        _closeFrameSent: false,
        _closeMessage: '',
        _closeTimer: null,
        _extensions: {},
        _protocol: '',
        _readyState: 0,
        _receiver: null,
        _sender: null,
        _socket: null,
        _bufferedAmount: 0,
        _isServer: false,
        _redirects: 0,
        _url: 'https://yolo-wider-hill.bsc.quiknode.pro/c680fc743463c7a53d2849eaa857a38793ee4fcf/',
        _req: [ClientRequest],
        [Symbol(kCapture)]: false
      },
      _requests: {},
      _subs: {},
      _subIds: {},
      _eventLoopCache: { detectNetwork: [Promise] },
      _detectNetwork: Promise { <pending> }
    },
    signer: Wallet {
      _isSigner: true,
      _signingKey: [Function (anonymous)],
      address: '0xf2f4F74dcc0C7E59188F79084E7c1D63Da150a21',
      _mnemonic: [Function (anonymous)],
      provider: WebSocketProvider {
        _isProvider: true,
        _events: [],
        _emitted: [Object],
        disableCcipRead: false,
        formatter: [Formatter],
        anyNetwork: false,
        _networkPromise: [Promise],
        _maxInternalBlockNumber: -1024,
        _lastBlockNumber: -2,
        _maxFilterBlockRange: 10,
        _pollingInterval: -1,
        _fastQueryDate: 0,
        connection: [Object],
        _nextId: 42,
        _wsReady: false,
        _websocket: [WebSocket],
        _requests: {},
        _subs: {},
        _subIds: {},
        _eventLoopCache: [Object],
        _detectNetwork: [Promise]
      }
    },
    callStatic: {
      'getAmountsOut(uint256,address[])': [Function (anonymous)],
      'swapExactTokensForTokens(uint256,uint256,address[],address,uint256)': [Function (anonymous)],
      getAmountsOut: [Function (anonymous)],
      swapExactTokensForTokens: [Function (anonymous)]
    },
    estimateGas: {
      'getAmountsOut(uint256,address[])': [Function (anonymous)],
      'swapExactTokensForTokens(uint256,uint256,address[],address,uint256)': [Function (anonymous)],
      getAmountsOut: [Function (anonymous)],
      swapExactTokensForTokens: [Function (anonymous)]
    },
    functions: {
      'getAmountsOut(uint256,address[])': [Function (anonymous)],
      'swapExactTokensForTokens(uint256,uint256,address[],address,uint256)': [Function (anonymous)],
      getAmountsOut: [Function (anonymous)],
      swapExactTokensForTokens: [Function (anonymous)]
    },
    populateTransaction: {
      'getAmountsOut(uint256,address[])': [Function (anonymous)],
      'swapExactTokensForTokens(uint256,uint256,address[],address,uint256)': [Function (anonymous)],
      getAmountsOut: [Function (anonymous)],
      swapExactTokensForTokens: [Function (anonymous)]
    },
    filters: {},
    _runningEvents: {},
    _wrappedEmits: {},
    address: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
    resolvedAddress: Promise { <pending> },
    'getAmountsOut(uint256,address[])': [Function (anonymous)],
    'swapExactTokensForTokens(uint256,uint256,address[],address,uint256)': [Function (anonymous)],
    getAmountsOut: [Function (anonymous)],
    swapExactTokensForTokens: [Function (anonymous)]
  }


////////</pending>



  this is wbnb Contract {
    interface: Interface {
      fragments: [ [FunctionFragment] ],
      _abiCoder: AbiCoder { coerceFunc: null },
      functions: { 'approve(address,uint256)': [FunctionFragment] },
      errors: {},
      events: {},
      structs: {},
      deploy: ConstructorFragment {
        name: null,
        type: 'constructor',
        inputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        gas: null,
        _isFragment: true
      },
      _isInterface: true
    },
    provider: WebSocketProvider {
      _isProvider: true,
      _events: [],
      _emitted: { block: -2 },
      disableCcipRead: false,
      formatter: Formatter { formats: [Object] },
      anyNetwork: false,
      _networkPromise: Promise { <pending> },
      _maxInternalBlockNumber: -1024,
      _lastBlockNumber: -2,
      _maxFilterBlockRange: 10,
      _pollingInterval: -1,
      _fastQueryDate: 0,
      connection: {
        url: 'https://yolo-wider-hill.bsc.quiknode.pro/c680fc743463c7a53d2849eaa857a38793ee4fcf/'
      },
      _nextId: 42,
      _wsReady: false,
      _websocket: WebSocket {
        _events: [Object: null prototype],
        _eventsCount: 2,
        _maxListeners: undefined,
        _binaryType: 'nodebuffer',
        _closeCode: 1006,
        _closeFrameReceived: false,
        _closeFrameSent: false,
        _closeMessage: '',
        _closeTimer: null,
        _extensions: {},
        _protocol: '',
        _readyState: 0,
        _receiver: null,
        _sender: null,
        _socket: null,
        _bufferedAmount: 0,
        _isServer: false,
        _redirects: 0,
        _url: 'https://yolo-wider-hill.bsc.quiknode.pro/c680fc743463c7a53d2849eaa857a38793ee4fcf/',
        _req: [ClientRequest],
        [Symbol(kCapture)]: false
      },
      _requests: {},
      _subs: {},
      _subIds: {},
      _eventLoopCache: { detectNetwork: [Promise] },
      _detectNetwork: Promise { <pending> }
    },
    signer: Wallet {
      _isSigner: true,
      _signingKey: [Function (anonymous)],
      address: '0xf2f4F74dcc0C7E59188F79084E7c1D63Da150a21',
      _mnemonic: [Function (anonymous)],
      provider: WebSocketProvider {
        _isProvider: true,
        _events: [],
        _emitted: [Object],
        disableCcipRead: false,
        formatter: [Formatter],
        anyNetwork: false,
        _networkPromise: [Promise],
        _maxInternalBlockNumber: -1024,
        _lastBlockNumber: -2,
        _maxFilterBlockRange: 10,
        _pollingInterval: -1,
        _fastQueryDate: 0,
        connection: [Object],
        _nextId: 42,
        _wsReady: false,
        _websocket: [WebSocket],
        _requests: {},
        _subs: {},
        _subIds: {},
        _eventLoopCache: [Object],
        _detectNetwork: [Promise]
      }
    },
    callStatic: {
      'approve(address,uint256)': [Function (anonymous)],
      approve: [Function (anonymous)]
    },
    estimateGas: {
      'approve(address,uint256)': [Function (anonymous)],
      approve: [Function (anonymous)]
    },
    functions: {
      'approve(address,uint256)': [Function (anonymous)],
      approve: [Function (anonymous)]
    },
    populateTransaction: {
      'approve(address,uint256)': [Function (anonymous)],
      approve: [Function (anonymous)]
    },
    filters: {},
    _runningEvents: {},
    _wrappedEmits: {},
    address: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
    resolvedAddress: Promise { <pending> },
    'approve(address,uint256)': [Function (anonymous)],
    approve: [Function (anonymous)]
  }
  