from typing import List, Dict
from ..models.paper import Paper, EvidenceExtraction, RiskOfBiasDetail, ScreeningAudit

def get_default_transformer_papers() -> List[Paper]:
    """Curated benchmark corpus on Transformer Efficiency, Sparsity and Sub-Quadratic Attention."""
    papers_data = [
        {
            "id": "p-vaswani-17",
            "doi": "10.48550/arXiv.1706.03762",
            "title": "Attention Is All You Need",
            "authors": ["Ashish Vaswani", "Noam Shazeer", "Niki Parmar", "Jakob Uszkoreit", "Llion Jones", "Aidan N. Gomez", "Lukasz Kaiser", "Illia Polosukhin"],
            "year": 2017,
            "venue": "NeurIPS 2017",
            "citations_count": 128400,
            "source": "arXiv",
            "abstract": "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely. Experiments on two machine translation tasks show these models to be superior in quality while being more parallelizable and requiring significantly less time to train.",
            "screening": {
                "status": "included",
                "score": 98.0,
                "confidence": 0.99,
                "exclusion_reason": None,
                "matched_criteria": ["Establishes baseline dense quadratic attention comparator", "Primary source for Multi-Head Self-Attention", "Reports BLEU translation benchmarks"],
                "violated_criteria": []
            },
            "extraction": {
                "methodology_type": "Empirical Benchmark / Foundational Architecture",
                "sample_size": "WMT 2014 English-German (4.5M pairs), WMT 2014 English-French (36M pairs)",
                "population_setting": "Encoder-Decoder Translation & Constituent Parsing",
                "intervention_or_approach": "Dense Multi-Head Self-Attention with sinusoidal positional encodings",
                "comparator_or_baseline": "ByteNet, ConvS2S, GNMT (Recurrent LSTM architectures)",
                "primary_outcome": "BLEU score (28.4 En-De) and training compute (3.5 days on 8 P100 GPUs)",
                "quantitative_findings": ["28.4 BLEU on WMT 2014 English-German (+2.0 BLEU over previous SOTA)", "O(n^2) sequence length time and space complexity", "Trained in 3.5 days on 8 P100 GPUs (vs 3 weeks for GNMT)"],
                "limitations": "Quadratic memory footprint O(n^2) inhibits scaling to long sequence contexts (> 512 tokens).",
                "key_findings": "Demonstrated that pure attention without recurrence outperforms RNNs with superior parallelization.",
                "dataset_or_benchmark": "WMT 2014 English-German & English-French",
                "open_science_artifacts": "Code released in Tensor2Tensor GitHub repository"
            },
            "risk_of_bias": {
                "overall": "Low",
                "selection_bias": "Low",
                "performance_bias": "Low",
                "attrition_bias": "Low",
                "detection_bias": "Low",
                "reporting_bias": "Low",
                "justification": "Clear ablation benchmarks on multiple seeds and publicly verified WMT test splits."
            },
            "thematic_cluster": "Baseline Quadratic Architectures"
        },
        {
            "id": "p-dao-22",
            "doi": "10.48550/arXiv.2205.14135",
            "title": "FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness",
            "authors": ["Tri Dao", "Daniel Y. Fu", "Stefano Ermon", "Atri Rudra", "Christopher Ré"],
            "year": 2022,
            "venue": "NeurIPS 2022 (Oral)",
            "citations_count": 3410,
            "source": "arXiv",
            "abstract": "Transformers are slow and memory-hungry on long sequences, since the time and memory complexity of self-attention are quadratic in sequence length. Approximate attention methods have attempted to address this, but often trade off model quality for speed and do not achieve wall-clock speedup. We argue that a missing principle is making attention algorithms IO-aware—accounting for reads and writes between levels of GPU memory. We propose FlashAttention, an IO-aware exact attention algorithm that uses tiling to reduce memory reads/writes between GPU HBM and SRAM. We extend FlashAttention to block-sparse attention, yielding an approximate attention algorithm that is faster than any existing approximate attention method.",
            "screening": {
                "status": "included",
                "score": 97.5,
                "confidence": 0.98,
                "exclusion_reason": None,
                "matched_criteria": ["Direct baseline comparator with standard attention", "Hardware IO-aware exact computation", "Quantitative wall-clock speedup and perplexity reported"],
                "violated_criteria": []
            },
            "extraction": {
                "methodology_type": "Hardware-Aware Empirical Benchmark & Kernel Engineering",
                "sample_size": "GPT-2 (125M-1.4B), BERT-large, Long Range Arena (1K-4K sequence lengths)",
                "population_setting": "Dense sequence modeling across NLP, vision, and long context benchmarks",
                "intervention_or_approach": "IO-aware tiled attention kernel keeping intermediate activation matrices in GPU SRAM",
                "comparator_or_baseline": "PyTorch standard standard attention, Megatron-LM, Linformer, Performer",
                "primary_outcome": "Wall-clock training speedup (2-4x) and zero memory growth for intermediate O(N^2) matrices",
                "quantitative_findings": ["3x speedup on GPT-2 125M over standard PyTorch attention", "Zero approximation error: exactly computes softmax attention without quality degradation", "Extended context to 64K tokens without out-of-memory errors on A100 GPUs"],
                "limitations": "Requires low-level CUDA SRAM layout optimization; hardware-specific tiling hyperparameters.",
                "key_findings": "Demonstrates that IO memory bandwidth, rather than FLOP count alone, dominates practical attention latency.",
                "dataset_or_benchmark": "Long Range Arena, WikiText-103, OpenWebText",
                "open_science_artifacts": "FlashAttention open-source CUDA repository on GitHub"
            },
            "risk_of_bias": {
                "overall": "Low",
                "selection_bias": "Low",
                "performance_bias": "Low",
                "attrition_bias": "Low",
                "detection_bias": "Low",
                "reporting_bias": "Low",
                "justification": "Extensive wall-clock timings across multiple GPU generations (A100, RTX3090) with reproducible scripts."
            },
            "thematic_cluster": "Hardware & IO Optimization"
        },
        {
            "id": "p-wang-20",
            "doi": "10.48550/arXiv.2006.04768",
            "title": "Linformer: Self-Attention with Linear Complexity",
            "authors": ["Sinong Wang", "Barlas Oguz", "Matteo Sachser", "Michael Auli", "Hao Peng"],
            "year": 2020,
            "venue": "Peer-Reviewed Pre-print / ACL Findings",
            "citations_count": 1820,
            "source": "arXiv",
            "abstract": "Standard self-attention requires computing an N by N attention matrix, incurring O(N^2) time and space complexity in terms of sequence length N. In this paper, we demonstrate that the self-attention mechanism can be approximated by a low-rank matrix. We show that the singular value decomposition of the attention matrix reveals a sharp drop in singular values. Based on this theoretical insight, we propose Linformer, which projects the length dimension of keys and values into a lower-dimensional representation k. Linformer scales linearly O(N) with sequence length in both time and memory.",
            "screening": {
                "status": "included",
                "score": 94.0,
                "confidence": 0.95,
                "exclusion_reason": None,
                "matched_criteria": ["Linear complexity approximation", "Reports empirical GLUE downstream benchmarks", "Direct comparison to standard Transformer"],
                "violated_criteria": []
            },
            "extraction": {
                "methodology_type": "Theoretical Low-Rank Projection & Empirical Evaluation",
                "sample_size": "RoBERTa-base pre-training on BookCorpus & Wikipedia (16GB text)",
                "population_setting": "Pre-trained masked language models on GLUE benchmark tasks",
                "intervention_or_approach": "Linear projection of Key/Value sequence length dimension from N to fixed dimension k",
                "comparator_or_baseline": "Standard RoBERTa-base (O(N^2)) and Reformer",
                "primary_outcome": "Inference time scaling and GLUE downstream evaluation score",
                "quantitative_findings": ["O(N) time and space complexity achieved for fixed projection dimension k=256", "Maintains 98.4% of RoBERTa GLUE benchmark accuracy at N=512", "At N=4096 tokens, achieves 13x speedup in inference step time"],
                "limitations": "Fixed sequence length projection hinders autoregressive generation with dynamic sequence lengths.",
                "key_findings": "Attention matrices exhibit low effective spectral rank, enabling linear projection without severe downstream loss.",
                "dataset_or_benchmark": "GLUE benchmark (MNLI, QNLI, SST-2, QQP)",
                "open_science_artifacts": "Fairseq implementation available"
            },
            "risk_of_bias": {
                "overall": "Some Concerns",
                "selection_bias": "Low",
                "performance_bias": "Some Concerns",
                "attrition_bias": "Low",
                "detection_bias": "Low",
                "reporting_bias": "Low",
                "justification": "Primary evaluation conducted predominantly on bidirectional encoder models; autoregressive decoder validation limited."
            },
            "thematic_cluster": "Linear & Low-Rank Approximations"
        },
        {
            "id": "p-choromanski-20",
            "doi": "10.48550/arXiv.2009.14794",
            "title": "Rethinking Attention with Performers",
            "authors": ["Krzysztof Choromanski", "Valerii Likhosherstov", "David Dohan", "Xingyou Song", "Andreea Gane", "Tamás Sarlós", "Peter Hawkins", "Adrian Davis"],
            "year": 2020,
            "venue": "ICLR 2021",
            "citations_count": 2190,
            "source": "arXiv",
            "abstract": "We introduce Performers, Transformer architectures that estimate regular full-rank-attention mechanisms with provable accuracy, but using only linear space and time complexity, without relying on any structural priors such as sparsity or low-rankness. To approximate the softmax attention kernel, we propose Fast Attention Via positive Orthogonal Random features (FAVOR+), which provides scalable unbiased estimation of attention matrices. We evaluate Performers across a broad spectrum of tasks including protein sequence modeling and image generation.",
            "screening": {
                "status": "included",
                "score": 93.0,
                "confidence": 0.94,
                "exclusion_reason": None,
                "matched_criteria": ["Kernel approximation of attention", "Unbiased theoretical bounds", "Tested on long protein and text sequences"],
                "violated_criteria": []
            },
            "extraction": {
                "methodology_type": "Kernel Random Feature Mapping / Randomized Linear Attention",
                "sample_size": "Protein sequences (TrEMBL, 30M sequences), ImageNet-64, Long Range Arena",
                "population_setting": "Protein fold prediction and long-context language modeling",
                "intervention_or_approach": "FAVOR+ mechanism using positive orthogonal random features to approximate softmax kernel",
                "comparator_or_baseline": "Exact Transformer, Reformer, Linformer",
                "primary_outcome": "Perplexity, backward pass memory consumption, and training throughput",
                "quantitative_findings": ["Strictly linear O(N) computational complexity in sequence length", "Zero catastrophic variance divergence due to strictly positive random features", "Enables training on sequence lengths exceeding 32,768 tokens without memory exhaustion"],
                "limitations": "Random feature dimension introduces variance in small batch regimes; slight degradation on fine-grained token classification.",
                "key_findings": "Positive orthogonal random features enable unbiased estimation of standard softmax attention with linear compute.",
                "dataset_or_benchmark": "Long Range Arena, TrEMBL Protein Database, PG-19",
                "open_science_artifacts": "Google Research GitHub repository"
            },
            "risk_of_bias": {
                "overall": "Low",
                "selection_bias": "Low",
                "performance_bias": "Low",
                "attrition_bias": "Low",
                "detection_bias": "Low",
                "reporting_bias": "Low",
                "justification": "Comprehensive theoretical error bounds combined with empirical verification on diverse modalities."
            },
            "thematic_cluster": "Kernel & Random Feature Methods"
        },
        {
            "id": "p-beltagy-20",
            "doi": "10.48550/arXiv.2004.05150",
            "title": "Longformer: The Long-Document Transformer",
            "authors": ["Iz Beltagy", "Matthew E. Peters", "Arman Cohan"],
            "year": 2020,
            "venue": "Peer-Reviewed / ACL 2020 Findings",
            "citations_count": 3950,
            "source": "arXiv",
            "abstract": "Transformer-based models are unable to process long sequences due to their self-attention operation, which scales quadratically with sequence length. To address this, we present Longformer with an attention mechanism that scales linearly with sequence length, making it easy to process documents of thousands of tokens or longer. Longformer's attention mechanism is a drop-in replacement for the standard self-attention and combines a local windowed attention with a task-motivated global attention.",
            "screening": {
                "status": "included",
                "score": 95.0,
                "confidence": 0.96,
                "exclusion_reason": None,
                "matched_criteria": ["Sparse windowed attention mechanism", "Evaluated on multi-thousand token documents", "Drop-in replacement for RoBERTa"],
                "violated_criteria": []
            },
            "extraction": {
                "methodology_type": "Sparse Structured Attention / Windowed Local-Global Pattern",
                "sample_size": "Text8, enwik8, HotpotQA, TriviaQA, WikiHop, Hyperpartisan News",
                "population_setting": "Document-level QA, coreference resolution, and long document classification",
                "intervention_or_approach": "Sliding window local attention combined with dilated windows and sparse global task-specific tokens",
                "comparator_or_baseline": "RoBERTa-large, BigBird, Reformer, Transformer-XL",
                "primary_outcome": "F1 score on QA benchmarks and BPC (bits-per-character) language modeling",
                "quantitative_findings": ["Scales linearly O(N x w) where w is sliding window size (typically 512 tokens)", "Processes up to 4,096 tokens directly on standard GPUs", "Outperforms RoBERTa on long-document QA by up to +4.3 F1 points"],
                "limitations": "Requires custom CUDA kernel implementation for dilated sliding window attention to realize speedups.",
                "key_findings": "Combining local receptive fields with a small budget of global tokens preserves long-range semantic reasoning.",
                "dataset_or_benchmark": "HotpotQA, TriviaQA, WikiHop, arXiv summarization",
                "open_science_artifacts": "Allen Institute for AI GitHub release with HuggingFace integration"
            },
            "risk_of_bias": {
                "overall": "Low",
                "selection_bias": "Low",
                "performance_bias": "Low",
                "attrition_bias": "Low",
                "detection_bias": "Low",
                "reporting_bias": "Low",
                "justification": "Evaluated across multiple established standard QA benchmarks with identical test protocol."
            },
            "thematic_cluster": "Sparse & Windowed Attention"
        },
        {
            "id": "p-sanh-19",
            "doi": "10.48550/arXiv.1910.01108",
            "title": "DistilBERT, a distilled version of BERT: smaller, faster, cheaper and lighter",
            "authors": ["Victor Sanh", "Lysandre Debut", "Julien Chaumond", "Thomas Wolf"],
            "year": 2019,
            "venue": "NeurIPS 2019 EMC2 Workshop",
            "citations_count": 6800,
            "source": "arXiv",
            "abstract": "As Transfer Learning from large-scale pre-trained models becomes more prevalent in Natural Language Processing (NLP), operating these large models in on-the-edge and/or under constrained computational training or inference budgets remains challenging. In this paper, we present a method to pre-train a smaller general-purpose language representation model, called DistilBERT, which can then be fine-tuned with good performances on a wide range of tasks like its larger counterparts. While most prior work investigated the use of distillation for building task-specific models, we leverage knowledge distillation during the pre-training phase and show that we can reduce the size of a BERT model by 40%, while retaining 97% of its language understanding capabilities and being 60% faster.",
            "screening": {
                "status": "included",
                "score": 92.0,
                "confidence": 0.93,
                "exclusion_reason": None,
                "matched_criteria": ["Knowledge distillation approach to transformer efficiency", "Latency and parameter reduction metrics reported", "Standard BERT comparator"],
                "violated_criteria": []
            },
            "extraction": {
                "methodology_type": "Knowledge Distillation / Model Compression",
                "sample_size": "Toronto BookCorpus and English Wikipedia (same corpus as original BERT)",
                "population_setting": "Pre-training language models for resource-constrained edge deployments",
                "intervention_or_approach": "Triple distillation loss (cross-entropy, cosine embedding distance, and soft target probabilities) removing 50% of transformer layers",
                "comparator_or_baseline": "BERT-base (110M parameters)",
                "primary_outcome": "GLUE benchmark macro-score, parameter count (66M), and CPU/GPU inference latency",
                "quantitative_findings": ["40% parameter count reduction (66M vs 110M)", "60% wall-clock latency reduction on iPhone and standard CPUs", "Retains 97% of BERT-base performance on GLUE downstream tasks"],
                "limitations": "Distillation requires heavy teacher pre-training phase; does not alter quadratic sequence scaling within remaining layers.",
                "key_findings": "Pre-training knowledge distillation creates general-purpose compact models that retain inductive biases without task-specific tuning.",
                "dataset_or_benchmark": "GLUE benchmark (CoLA, MNLI, MRPC, QNLI, QQP, RTE, SST-2, STS-B)",
                "open_science_artifacts": "Hugging Face Transformers release"
            },
            "risk_of_bias": {
                "overall": "Low",
                "selection_bias": "Low",
                "performance_bias": "Low",
                "attrition_bias": "Low",
                "detection_bias": "Low",
                "reporting_bias": "Low",
                "justification": "Transparent distillation loss formulations and open reproducible fine-tuning evaluations."
            },
            "thematic_cluster": "Knowledge Distillation & Compression"
        },
        {
            "id": "p-tay-21",
            "doi": "10.1145/3530811",
            "title": "Long Range Arena: A Benchmark for Efficient Transformers",
            "authors": ["Yi Tay", "Mostafa Dehghani", "Samira Abnar", "Yikang Shen", "Dara Bahri", "Philip Pham", "Jinfeng Rao", "Liu Yang", "Sebastian Ruder", "Donald Metzler"],
            "year": 2021,
            "venue": "ACM Computing Surveys / ICLR 2021",
            "citations_count": 1420,
            "source": "CrossRef",
            "abstract": "Transformers are increasingly used across a wide variety of modalities. In tandem, a key challenge is addressing their quadratic computational and memory complexity with respect to the sequence length. While numerous efficient transformer architectures have been proposed, a comprehensive, systematic, and standardized evaluation of their empirical trade-offs has been conspicuously absent. We introduce Long Range Arena (LRA), a standardized suite of tasks evaluating efficiency, memory footprint, and quality across sequence lengths from 1K to 16K tokens across text, synthetic languages, and visual imagery.",
            "screening": {
                "status": "included",
                "score": 99.0,
                "confidence": 0.99,
                "exclusion_reason": None,
                "matched_criteria": ["Standardized systematic benchmark for efficient transformers", "Compares 10+ efficient attention variants under identical hardware conditions", "Comprehensive latency, peak memory, and accuracy measurements"],
                "violated_criteria": []
            },
            "extraction": {
                "methodology_type": "Comparative Meta-Benchmark / Standardized Empirical Evaluation",
                "sample_size": "6 rigorous long-context tasks: ListOps (2K), Text Classification (4K), Retrieval (4K), Pathfinder (1K), Pathfinder-X (16K), Image-64 (1K)",
                "population_setting": "Multi-modal sequence modeling across 10 efficient transformer architectures",
                "intervention_or_approach": "Unified benchmarking harness measuring speed, peak memory, and accuracy under fixed parameter budgets",
                "comparator_or_baseline": "Standard Transformer vs Linformer, Performer, Reformer, Longformer, BigBird, Linear Transformer, Synthesizer",
                "primary_outcome": "Score vs memory efficiency frontier across 1,000 to 16,000 sequence lengths",
                "quantitative_findings": ["No single architecture dominates across all 6 benchmark tasks", "Low-rank methods (Linformer) fail on hierarchical reasoning (ListOps) but excel at retrieval", "Kernel methods (Performer) maintain robust speed but struggle with fine-grained positional discrimination", "All evaluated models except BigBird failed on the 16K Pathfinder-X extreme long-range challenge"],
                "limitations": "Standardized hyperparameters may under-represent architectures that require specialized learning rate schedules.",
                "key_findings": "Uncovered significant trade-offs between sequence length scalability and modeling expressiveness, proving that architectural suitability is highly task-dependent.",
                "dataset_or_benchmark": "Long Range Arena (LRA) Benchmark Suite",
                "open_science_artifacts": "TensorFlow / JAX benchmark suite released on GitHub"
            },
            "risk_of_bias": {
                "overall": "Low",
                "selection_bias": "Low",
                "performance_bias": "Low",
                "attrition_bias": "Low",
                "detection_bias": "Low",
                "reporting_bias": "Low",
                "justification": "Exemplary standard for empirical benchmarks: unified hardware (NVIDIA V100), fixed parameter limits, and open code."
            },
            "thematic_cluster": "Standardized Benchmarking & Meta-Evaluation"
        },
        {
            "id": "p-gu-23",
            "doi": "10.48550/arXiv.2312.00752",
            "title": "Mamba: Linear-Time Sequence Modeling with Selective State Spaces",
            "authors": ["Albert Gu", "Tri Dao"],
            "year": 2023,
            "venue": "Peer-Reviewed / arXiv preprint",
            "citations_count": 1850,
            "source": "arXiv",
            "abstract": "Foundation models, now powering most of the exciting applications in deep learning, are almost universally based on the Transformer architecture and its core attention module. However, Transformers' quadratic computational complexity prevents scaling to long contexts. While many sub-quadratic time architectures have been proposed, they have historically failed to match the downstream quality of attention. We hypothesize that an important weakness is their inability to perform content-based reasoning. We introduce Mamba, a selective state space architecture that achieves linear-time sequence modeling with hardware-aware recurrent computation.",
            "screening": {
                "status": "included",
                "score": 96.0,
                "confidence": 0.97,
                "exclusion_reason": None,
                "matched_criteria": ["Sub-quadratic attention alternative", "Direct perplexity and downstream accuracy comparison to Transformers", "Wall-clock hardware scaling verified"],
                "violated_criteria": []
            },
            "extraction": {
                "methodology_type": "Selective State-Space Architecture & Hardware-Aware Kernel",
                "sample_size": "Pre-trained at 130M, 370M, 790M, 1.4B, and 2.8B parameters on The Pile (300B tokens)",
                "population_setting": "Autoregressive causal language modeling across 1M token contexts",
                "intervention_or_approach": "Selective state-space model (SSM) with input-dependent transition parameters computed via fused GPU SRAM scan",
                "comparator_or_baseline": "Llama-architecture Transformers, RWKV, Hyena, H3, Mega",
                "primary_outcome": "Zero-shot accuracy, validation perplexity, and 5x inference throughput speedup",
                "quantitative_findings": ["5x higher inference throughput than Transformers of matching parameter scale", "Matches or outperforms Transformers across standard zero-shot benchmarks (PIQA, HellaSwag, ARC)", "Linear O(N) memory scaling allows scaling context up to 1,000,000 tokens during inference"],
                "limitations": "Limited associative recall capacity compared to full quadratic KV-cache without hybrid attention layers.",
                "key_findings": "Proves that content-selective recurrence overcomes historical expressiveness deficits in linear state-space models.",
                "dataset_or_benchmark": "The Pile, Lambada, HellaSwag, PIQA, ARC-Challenge",
                "open_science_artifacts": "PyTorch / CUDA open-source repository"
            },
            "risk_of_bias": {
                "overall": "Low",
                "selection_bias": "Low",
                "performance_bias": "Low",
                "attrition_bias": "Low",
                "detection_bias": "Low",
                "reporting_bias": "Low",
                "justification": "Comprehensive scaling laws evaluated across 5 distinct model sizes trained on identical data budgets."
            },
            "thematic_cluster": "State-Space & Recurrent Hybrid Models"
        },
        # Excluded Papers for PRISMA Compliance Demonstration
        {
            "id": "p-ex-01",
            "doi": "10.1016/j.cosrev.2021.100421",
            "title": "A Survey on Transformers in Computer Vision: Architectures, Challenges, and Perspectives",
            "authors": ["Kai Han", "Yunhe Wang", "Hanting Chen"],
            "year": 2022,
            "venue": "Computer Science Review",
            "citations_count": 2100,
            "source": "CrossRef",
            "abstract": "Transformers have shown substantial success in natural language processing and are now being actively applied in computer vision. This survey provides a qualitative taxonomy of vision transformers (ViT), detailing patch extraction, positional encodings, and self-attention applications across object detection, semantic segmentation, and video classification.",
            "screening": {
                "status": "excluded",
                "score": 38.0,
                "confidence": 0.92,
                "exclusion_reason": "Violates Exclusion Criterion #4: Focuses exclusively on vision transformers without sequence modeling efficiency evaluation",
                "matched_criteria": [],
                "violated_criteria": ["Focus solely on vision transformers without sequence modeling comparison", "Qualitative survey without new empirical benchmark"]
            },
            "thematic_cluster": "Excluded - Scope Mismatch"
        },
        {
            "id": "p-ex-02",
            "doi": "10.1109/ACCESS.2023.3289100",
            "title": "Ethical Considerations and Societal Implications of Large-Scale Generative Transformers",
            "authors": ["Elena Rostova", "Marcus Vance"],
            "year": 2023,
            "venue": "IEEE Access",
            "citations_count": 45,
            "source": "CrossRef",
            "abstract": "As large language models proliferate across public institutions, questions of governance, algorithmic bias, copyright infringement, and environmental energy consumption arise. This article outlines philosophical arguments and governance frameworks for responsible model deployment.",
            "screening": {
                "status": "excluded",
                "score": 15.0,
                "confidence": 0.98,
                "exclusion_reason": "Violates Exclusion Criterion #1: Non-empirical ethical commentary lacking quantitative benchmark comparisons",
                "matched_criteria": [],
                "violated_criteria": ["Non-empirical qualitative opinion pieces or unverified editorials", "No baseline comparator reported"]
            },
            "thematic_cluster": "Excluded - Non-Empirical"
        }
    ]

    papers = []
    for item in papers_data:
        extraction = EvidenceExtraction(**item["extraction"]) if "extraction" in item else None
        rob = RiskOfBiasDetail(**item["risk_of_bias"]) if "risk_of_bias" in item else None
        screening = ScreeningAudit(**item["screening"]) if "screening" in item else ScreeningAudit()
        
        paper = Paper(
            id=item["id"],
            doi=item.get("doi"),
            title=item["title"],
            authors=item["authors"],
            year=item["year"],
            venue=item.get("venue"),
            citations_count=item.get("citations_count", 0),
            source=item.get("source", "Benchmark Corpus"),
            abstract=item["abstract"],
            screening=screening,
            extraction=extraction,
            risk_of_bias=rob,
            thematic_cluster=item.get("thematic_cluster"),
            tags=["Included Study" if screening.status == "included" else "Excluded Record", item.get("venue", "")]
        )
        papers.append(paper)

    return papers
